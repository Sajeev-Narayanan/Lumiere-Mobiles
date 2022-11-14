// const userAuth = (req,res,next)=>{
//     if(!req.session.email && next.session.state != true){
//         let err = new Error("You are not authenticated");
//     res.setHeader("WWW-Authenticate", "Basic");
//     err.status = 401;
//     // res.redirect("/");
//     res.render("pageNotFound.ejs");
//     return next(err);
//     }
// }

const sessionCheckDashboard = (req, res, next) => {
    if (req.session.adminName) {
        next();
    }
    else {
        res.redirect('/admin')
    }

}
const sessionCheckAdminLogin = (req, res, next) => {
    if (req.session.adminName) {
        res.redirect('/admin/dashboard')
        
    }
    else {
        next();
       
    }

}
const sessionCheckuzUser = (req,res,next)=>{
    if(req.session.email&&req.session.state == true){
        next()
    }else{}
}

exports.sessionCheckDashboard = sessionCheckDashboard;
exports.sessionCheckAdminLogin = sessionCheckAdminLogin;
exports.sessionCheckuzUser = sessionCheckuzUser;