// It's Global constant file
// use "UPPER_SNAKE_CASE" to define
export const CONSTANTS = Object.freeze({
  WHATSAPP_URL: 'https://ziper.io/api/send.php',
  API: {
    QUESTIONS: "/GetQuestionsByTestId",
    // LOGIN: "/auth/login",
    LOGIN_SIGNUP: "/users/addUpdateUser",
    UPDATE_NAME: "/users/updateName",
    SUBMIT_SCORE: "/test/addScore",
    SUBMIT_RESULT: "/test/submitResult",
    GET_TEST: '/test/getTest',
    GET_DASHBOARD_DETAILS: '/result/getResultDashboard',
  },
  MESSAGES: {
    LOGIN_FAILURE: "Login failed",
    LOGIN_SUCCESS: "Login successful",
    SIGNUP_SUCCESS: "Singup successful",
    OTP_MESSAGE: "Here is you one time OTP: ",
    INVALID_OTP: "You have entered the wrong OTP.",
    OTP_SENT: "OTP has been sent to your Whatsapp no.",
  },
  VALIDATE: {
    PASSWORD_MAX_LENGTH: 8,
  },
  QUESTION_OPTIONS: ["A", "B", "C", "D"]
});

export type ButtonType = 'button' | 'submit';
export type AlertType = 'success' | 'info' | 'danger' | 'warning' | '';

export type StreamType = 'NEET' | 'JEE';
