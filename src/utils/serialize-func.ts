export const serializeFunction = (func: any): string => (func.toString());

export const deserializeFunction = (funcString: string) : any => (new Function(`return ${funcString}`)());