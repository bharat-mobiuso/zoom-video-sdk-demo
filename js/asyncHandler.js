export const asyncHandler = (asyncFun, callback) => {
    return () => {
        Promise.resolve(asyncFun()).catch(() => {
            callback();
        })
    }
}