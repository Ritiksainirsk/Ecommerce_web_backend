module.exports = (CatchAsyncError) =>(req,res,next)=>{
    Promise.resolve(CatchAsyncError(req,res,next)).catch(next)
}
