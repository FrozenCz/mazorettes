export abstract class Utils {

  public static createMap<T, K extends keyof T>(arr: T[], propertyName: K): Map<string, T> {
    const newMap = new Map<string, T>();

    for (let i = 0; i< arr.length; i++) {
      // @ts-ignore
      newMap.set(arr[i][propertyName], arr[i])
    }

    return newMap
  }


}
