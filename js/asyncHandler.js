export const asyncHandler = (asyncFun, callback) => {
    return () => {
        Promise.resolve(asyncFun()).catch((error) => {
            console.error('ERROR', error);
            callback('Oops, Something went wrong!', error.reason);
        })
    }
}