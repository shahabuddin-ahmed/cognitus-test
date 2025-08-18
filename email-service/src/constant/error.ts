export enum ERROR_CODES {
    E_PAGE_NOT_FOUND = "E_PAGE_NOT_FOUND",
    E_UNAUTHORIZED = "E_UNAUTHORIZED",
    E_FORBIDDEN = "E_FORBIDDEN",
    E_INVALID_DATA = "E_INVALID_DATA",
    E_VALIDATION_FAILED = "E_VALIDATION_FAILED",
    E_INTERNAL_SERVER_ERROR = "E_INTERNAL_SERVER_ERROR",
    BAD_REQUEST = "BAD_REQUEST",
    CAMPAIGN_ALREADY_EXISTS = "CAMPAIGN_ALREADY_EXISTS",
    CAMPAIGN_NOT_FOUND = "CAMPAIGN_NOT_FOUND",
    EMAIL_TEMPLATE_NOT_FOUND = "EMAIL_TEMPLATE_NOT_FOUND",
    E_EMAIL_TEMPLATE_ALREADY_EXISTS = "E_EMAIL_TEMPLATE_ALREADY_EXISTS",
    USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    EMAIL_NOT_FOUND = "EMAIL_NOT_FOUND"
}

export const errorMessages: Record<ERROR_CODES, { message: string }> = {
    E_PAGE_NOT_FOUND: {
        message: "please be sane and hit correct endpoints"
    },
    E_UNAUTHORIZED: {
        message: "Invalid user/api token",
    },
    E_FORBIDDEN: {
        message: "You are not authorized to access this resource",
    },
    E_INVALID_DATA: {
        message: "Please provide valid data",
    },
    E_VALIDATION_FAILED: {
        message: "Please fill up required all fields and valid data",
    },
    E_INTERNAL_SERVER_ERROR: {
        message: "Internal Server Error",
    },
    BAD_REQUEST: {
        message: "Bad Request"
    },
    CAMPAIGN_ALREADY_EXISTS: {
        message: "Campaign already exists"
    },
    CAMPAIGN_NOT_FOUND: {
        message: "Campaign not found"
    },
    EMAIL_TEMPLATE_NOT_FOUND: {
        message: "Email template not found"
    },
    E_EMAIL_TEMPLATE_ALREADY_EXISTS: {
        message: "Email template with this name already exists"
    },
    USER_ALREADY_EXISTS: {
        message: "User with this email already exists"
    },
    USER_NOT_FOUND: {
        message: "User not found"
    },
    EMAIL_NOT_FOUND: {
        message: "Email not found"
    }
};

export enum ApiResponseMessages {
    SUCCESS = "SUCCESS",
    INTERNAL_SERVER_ERROR = "Internal Server Error",
}