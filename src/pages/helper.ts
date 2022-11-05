export const sleep = (durationMilliseconds:number):Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, durationMilliseconds));
}