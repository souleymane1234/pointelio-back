interface ResponseConfig {
    status: number;
    description: string;
    schema?: new (...args: unknown[]) => unknown;
}
interface EndpointDocumentation {
    operation: {
        summary: string;
        description?: string;
    };
    responses: ResponseConfig[];
    headers?: Array<{
        name: string;
        description: string;
        required?: boolean;
    }>;
    extra?: (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
}
export declare function ApiDocumentation(config: EndpointDocumentation): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export {};
