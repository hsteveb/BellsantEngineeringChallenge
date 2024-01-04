import { WeldingRobotPart } from '~data/types';

export const objectToPairs = (value = {}, keyName = 'label') => {
  return Object.entries(value).map(([key, value]) => ({ [keyName]: key, value }))
};
