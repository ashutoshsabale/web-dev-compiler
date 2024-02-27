class ApiError extends Error {
    statusCode: number;
    data: any;
    success: boolean;
    errors: any[];

    constructor(
        statusCode: number,
        message: string = "Something went wrong!",
        errors: any[] = [],
        stack: string = ""
    ){
        super(message);
        this.statusCode= statusCode;
        this.data= null;
        this.errors= errors;
        this.success= false;

        if(stack){
            this.stack= stack;
        } else{
            Error.captureStackTrace(this,this.constructor);
        }

    }
    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message, // Include the message property
            errors: this.errors,
            success: this.success
        };
    }
}

export { ApiError }