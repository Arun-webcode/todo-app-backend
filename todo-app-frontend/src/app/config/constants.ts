export const ApiUrls = {
    profileUpdate: '/api/v1/user/profile/update', //put
    auth: {
        otpGen: '/api/v1/user/register', //post
        register: '/api/v1/user/createaccount', //post
        resetOtp: '/api/v1/user/sendotp', //post
        resetPass: '/api/v1/user/resetpassword', //put
        login: '/api/v1/user/login', //post
        logout: '/api/v1/user/logout', //get
        deleteAcc: '/api/v1/user/deleteaccount', //delete
        getUserDetails: '/api/v1/user/getUserDetails' //get
    },
    task: {
        createTask: '/api/v1/tasks/createtask', //post
        getAllTasks: '/api/v1/tasks/getalltasks', //get
        getTaskByUserid: '/api/v1/tasks/task/:id', //get
        updateTaskByTaskid: '/api/v1/tasks/task/:id', //put
        deleteTaskByTaskid: '/api/v1/tasks/task/:id' //del
    },
}