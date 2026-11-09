import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import {
  normalizeIp as normalizeClientIp,
  resolveClientIp,
} from "../utils/client-ip.util";

type IpBlockRule =
  | {
      kind: "exact";
      value: string;
      raw: string;
    }
  | {
      kind: "ipv4-cidr";
      network: number;
      mask: number;
      raw: string;
    };

@Injectable()
export class IpBlockService {
  private readonly logger = new Logger(IpBlockService.name);
  private readonly rules: IpBlockRule[];

  constructor(private readonly config: ConfigService) {
    this.rules = this.parseRules(this.config.get<string>("IP_BLOCKLIST", ""));

    if (this.rules.length > 0) {
      this.logger.log(`Loaded ${this.rules.length} blocked IP rule(s)`);
    }
  }

  isEnabled(): boolean {
    return this.config.get<string>("IP_BLOCK_ENABLED", "true") !== "false";
  }

  hasRules(): boolean {
    return this.rules.length > 0;
  }

  getClientIp(req: Request): string | undefined {
    return resolveClientIp(req);
  }

  isBlocked(ip: string | undefined): boolean {
    if (!ip) return false;

    const normalizedIp = this.normalizeIp(ip);
    const ipv4Number = this.ipv4ToNumber(normalizedIp);

    return this.rules.some((rule) => {
      if (rule.kind === "exact") {
        return normalizedIp === rule.value;
      }

      if (ipv4Number === undefined) {
        return false;
      }

      return (ipv4Number & rule.mask) >>> 0 === rule.network;
    });
  }

  private parseRules(rawList: string): IpBlockRule[] {
    return rawList
      .split(",")
      .map((raw) => raw.trim())
      .filter(Boolean)
      .map((raw) => this.parseRule(raw))
      .filter((rule): rule is IpBlockRule => Boolean(rule));
  }

  private parseRule(raw: string): IpBlockRule | undefined {
    const [ipPart, prefixPart] = raw.split("/");
    const normalizedIp = this.normalizeIp(ipPart);

    if (prefixPart === undefined) {
      return {
        kind: "exact",
        value: normalizedIp,
        raw,
      };
    }

    const prefix = Number(prefixPart);
    const ipNumber = this.ipv4ToNumber(normalizedIp);

    if (
      ipNumber === undefined ||
      !Number.isInteger(prefix) ||
      prefix < 0 ||
      prefix > 32
    ) {
      this.logger.warn(`Ignoring invalid IP block rule: ${raw}`);
      return undefined;
    }

    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;

    return {
      kind: "ipv4-cidr",
      network: (ipNumber & mask) >>> 0,
      mask,
      raw,
    };
  }

  private normalizeIp(rawIp: string): string {
    return normalizeClientIp(rawIp) ?? rawIp.trim().toLowerCase();
  }

  private ipv4ToNumber(ip: string): number | undefined {
    const parts = ip.split(".");

    if (parts.length !== 4) {
      return undefined;
    }

    const octets = parts.map((part) => Number(part));

    if (
      octets.some(
        (octet, index) =>
          !Number.isInteger(octet) ||
          octet < 0 ||
          octet > 255 ||
          String(octet) !== parts[index],
      )
    ) {
      return undefined;
    }

    return (
      ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>>
      0
    );
  }
}
