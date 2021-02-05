declare module 'school-kr' {
  export interface IType {
    KINDERGARTEN: Symbol;
    ELEMENTARY: Symbol;
    MIDDLE: Symbol;
    HIGH: Symbol;
  }

  export interface IRegion {
    SEOUL: Symbol;
    INCHEON: Symbol;
    BUSAN: Symbol;
    GWANGJU: Symbol;
    DAEJEON: Symbol;
    DAEGU: Symbol;
    SEJONG: Symbol;
    ULSAN: Symbol;
    GYEONGGI: Symbol;
    KANGWON: Symbol;
    CHUNGBUK: Symbol;
    CHUNGNAM: Symbol;
    GYEONGBUK: Symbol;
    GYEONGNAM: Symbol;
    JEONBUK: Symbol;
    JEONNAM: Symbol;
    JEJU: Symbol;
  }

  export type Year =
    | number
    | {
        year?: number;
        month?: number;
        default?: string;
        separator?: string;
      };

  export interface Day {
    '1': string;
    '2': string;
    '3': string;
    '4': string;
    '5': string;
    '6': string;
    '7': string;
    '8': string;
    '9': string;
    '10': string;
    '11': string;
    '12': string;
    '13': string;
    '14': string;
    '15': string;
    '16': string;
    '17': string;
    '18': string;
    '19': string;
    '20': string;
    '21': string;
    '22': string;
    '23': string;
    '24': string;
    '25': string;
    '26': string;
    '27': string;
    '28': string;
    '29': string;
    '30': string;
    '31': string;
  }

  export interface SearchReturnType {
    name: string;
    schoolCode: string;
    address: string;
  }

  export interface MealRetuenType extends Day {
    year: number;
    month: number;
    day: number;
    today: string;
  }

  export interface CalendarReturnType extends Day {
    year: number;
    month: number;
    day: number;
    today: string;
  }

  export default class School {
    static Type: IType;
    static Region: IRegion;

    init(type: Symbol, region: Symbol, schoolCode: string): void;
    getMeal(year?: Year, month?: number): Promise<MealRetuenType>;
    getCalendar(year?: Year, month?: number): Promise<CalendarReturnType>;

    search(region: Symbol, name: string): Promise<Array<SearchReturnType>>;
  }
}
