export default class Time {
    static time = new Date().valueOf() / 1000;
    static oldTime = 0;
    static deltaTime = 0;

    static main = (t) => {
        Time.time = t / 1000
        Time.deltaTime = Time.time - Time.oldTime;
        Time.oldTime = Time.time;
    }
}