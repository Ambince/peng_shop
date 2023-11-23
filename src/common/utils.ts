import { isValidCron } from 'cron-validator';

export const waitTime = (time: number = 100): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const cronExpressionCheck = (
  rule: any,
  value: any,
  callback: any,
): any => {
  if (!value) {
    return callback();
  }
  const expression = value as string;
  if (!isValidCron(expression, { seconds: true })) {
    callback('invalid corn expression');
  }
  if (expression.split(' ').length < 6) {
    callback('6 parameters are required, e.g: * * * * * *');
  }
  if (expression.endsWith(' ') || expression.startsWith(' ')) {
    callback('space detected at the beginning or the end');
  }
  const withoutSpace = expression.replaceAll(' ', '');
  if (expression.length - withoutSpace.length > 5) {
    callback('extra space detected');
  }
  return callback();
};

export const lineToCamel = (name: string): string => {
  return name.replace(/_(\w)/g, (_, letter) => {
    return letter.toUpperCase();
  });
};

export const camelToLine = (name: string): string => {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
};

export const query = (params: Record<string, any> | undefined): string => {
  if (!params) return '';
  Object.keys(params).forEach((key) => {
    if (params[key] && params[key].constructor === Array) {
      delete Object.assign(params, { [`${key}[]`]: params[key] })[key];
    }
  });
  const paramsResult = new URLSearchParams(params).toString();
  return paramsResult.length === 0 ? '' : `?${paramsResult}`;
};

export const lineCamelTransfer = (
  data: Record<string, any>,
  type: 'lineToCamel' | 'camelToLine',
): Record<string, any> => {
  if (!data) return undefined as any;
  const result = JSON.parse(JSON.stringify(data));
  Object.keys(data).forEach((key: string) => {
    const item = result[key];
    let newKey = key;

    if (type === 'lineToCamel') {
      newKey = lineToCamel(key);
    } else if (type === 'camelToLine') {
      newKey = camelToLine(key);
    }

    if (item instanceof Object) {
      result[newKey] = lineCamelTransfer(item, type);
    } else {
      result[newKey] = item;
    }
    if (newKey !== key) {
      delete result[key];
    }
  });
  return result;
};
