export const SUBMISSION_STATUS = {
  ACCEPTED: "Accepted",
  COMPILE_FAIL: "Compile Fail",
  WRONG_ANSWER: "Wrong Answer",
  TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
  MEMORY_LIMIT_EXCEEDED: "Memory Limit Exceeded",
  RUNTIME_ERROR: "Runtime Error",
  COMPILATION_ERROR: "Compilation Error",
  INTERNAL_ERROR: "Internal Error",
  PENDING: "Pending",
  JUDGING: "Judging",
}

export const IN_PROGRESS_STATUSES = new Set([
  SUBMISSION_STATUS.PENDING,
  SUBMISSION_STATUS.JUDGING,
])


