import axios from "axios"
import JSONbig from 'json-bigint';
const api_baseURL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9090/api"
// const api_baseURL = process.env.NEXT_PUBLIC_API_BASE || "http://bc.agiantii.top:9090/api"

// 创建axios实例
const request = axios.create({
  baseURL: api_baseURL,
  timeout: 10000,
  transformResponse: [data => JSONbig({ storeAsString: true }).parse(data)]
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 从localStorage获取userId
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      const { id } = JSON.parse(userInfo)
      // 如果是需要userId的接口，自动添加
      if ((config as any).needUserId) {
        config.params = { ...config.params, userId: id }
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 根据状态码判断请求是否成功
    if (res.code === 0 || res.code === 200) {
      return res
    } else {
      console.error(res.msg || "操作失败")
      return Promise.reject(new Error(res.msg || "操作失败"))
    }
  },
  (error) => {
    // 处理HTTP错误
    const message = error.response?.data?.msg || "请求失败"
    console.error(message)

    // 如果是401错误，清除登录状态
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("userInfo")
      window.location.href = "/login"
    }

    return Promise.reject(error)
  },
)

// ==================== 用户相关接口 ====================

export const login = (username: string, password: string) => {
  return request.post("/user/login", null, {
    params: { "username": username, "password": password },
  })
}

export const register = (userData: {
  username: string
  password: string
  email: string
  role?: string
  avatar_url?: string
}) => {
  return request.post("/user/add", userData)
}

export const updateUser = (
  id: number,
  userData: {
    username?: string
    password?: string
    email?: string
    role?: string
    status?: number
    avatar_url?: string
  },
) => {
  return request.put(`/user/${id}`, userData)
}

export const getUserById = (userId: string) => {
  return request.get("/user/get", { params: { arg0: userId } })
}

export const searchUsers = (keyword: string) => {
  return request.get("/user/search", { params: { arg0: keyword } })
}

export const deleteUser = (userId: number) => {
  return request.get("/user/delete", { params: { arg0: userId } })
}

// ==================== 题目相关接口 ====================

export const searchProblems = (params: {
  titleKeyword?: string
  descriptionKeyword?: string
  tagName?: string
  tagId?: number
  pageNum?: number
  pageSize?: number
}) => {
  return request.get("/problem/search", { params })
}

export const getProblemDetail = (problemId: number) => {
  return request.get("/problem/detail", { params: { problemId } })
}

export const createProblem = (problemData: {
  title: string
  description: string
  difficulty: number
  timeLimit: number
  memoryLimit: number
  status?: number
  testInput?: string
  testOutput?: string
}) => {
  return request.post("/problem/add", problemData)
}

export const submitProblem = (submission: {
  problemId: number
  userId: number
  language: string
  code: string
  status?: string
  runtime?: number
  memory?: number
  failMsg?: string
  input?: string
  output?: string
  expectedOutput?: string
  contestId?: number
}) => {
  return request.post("/problem/submit", submission)
}

export const getSubmissionCount = (problemId: number) => {
  return request.get("/problem/getSubmissionCount", { params: { problemId } })
}

export const getPassedCount = (problemId: number) => {
  return request.get("/problem/getPassedCount", { params: { problemId } })
}

// ==================== 题目测试用例相关接口 ====================

export const getProblemCases = (problemId: number) => {
  return request.get("/problemCase/getProblemCases", { params: { problemId } })
}

export const uploadProblemCasesZip = (problemId: number, file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  return request.post("/problemCase/uploadZip", formData, {
    params: { problemId },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

// ==================== 提交记录相关接口 ====================

export const getSubmissionStatus = (submissionId: string) => {
  return request.get("/submit/getStatus", { params: { submissionId } })
}

// ==================== 题解相关接口 ====================

export const addSolution = (solution: {
  problemId: number
  userId: number
  title: string
  content: string
  status?: number
  msg?: string
}) => {
  return request.post("/solution/add", solution)
}

export const searchSolutions = (params: {
  keyword: string
  visible: number
  pageNum: number
  pageSize: number
  problemId?: number
}) => {
  return request.get("/solution/search", { params })
}

export const getSolutionsByProblemId = (problemId: number, pageNum = 1, pageSize = 10) => {
  return request.get("/solution/getByProblemId", {
    params: { problemId, pageNum, pageSize },
  })
}

export const approveSolution = (solutionId: number) => {
  return request.get("/solution/approve", { params: { solutionId } })
}

export const rejectSolution = (solutionId: number) => {
  return request.get("/solution/reject", { params: { solutionId } })
}

// ==================== 比赛相关接口 ====================

export const searchContests = (keyword: string, pageNum = 1, pageSize = 10) => {
  return request.get("/contest/searchContest", {
    params: { keyword, pageNum, pageSize },
  })
}

export const getContestProblems = (contestId: number) => {
  return request.get("/contest/getContestProblems", { params: { contestId } })
}

export const addContest = (contest: {
  title: string
  description: string
  startTime: string
  endTime: string
  duration: number
  penaltyConstant: number
}) => {
  return request.get("/contest/addContest", { params: contest })
}

export const deleteContest = (contestId: number) => {
  return request.get("/contest/deleteContest", { params: { contestId } })
}

export const addProblemToContest = (contestId: number, problemId: number) => {
  return request.get("/contest/addProblemToContest", {
    params: { contestId, problemId },
  })
}

// ==================== 聊天相关接口 ====================

export const newChat = (userId: number, title?: string) => {
  return request.get("/chat/new", { params: { userId, title } })
}

export const getChatHistory = (userId: number) => {
  return request.get("/chat/getHistory", { params: { userId } })
}

export const streamChatSimple = (query?: string, stop = false) => {
  return request.get("/chat/stream/simple", { params: { query, stop } })
}

export const streamChatWithMemory = (params: {
  query?: string
  problemId?: number
  stop?: boolean
  messageId?: number
}) => {
  return request.get("/chat/stream/memory", { params })
}

export const chatCall = (query?: string) => {
  return request.get("/chat/call", { params: { query } })
}

export const chatRagAdvisorBackup = (query?: string) => {
  return request.get("/chat/chat-rag-advisor-backup", { params: { query } })
}

export const chatAdd = () => {
  return request.get("/chat/add")
}

// ==================== 聊天备份相关接口 ====================

export const chatBackupTest = () => {
  return request.get("/chat-backup/test")
}

export const chatBackupStream = (query?: string, stop = false) => {
  return request.get("/chat-backup/stream", { params: { query, stop } })
}

export const chatBackupCall = (query?: string, problemId?: number) => {
  return request.get("/chat-backup/call", { params: { query, problem_id: problemId } })
}

// ==================== 图片上传接口 ====================

export const uploadImage = (file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  return request.post("/image/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

// ==================== 向量搜索接口 ====================

export const vectorSearch = () => {
  return request.get("/vector/simple/search")
}

export const vectorSearchFilter = () => {
  return request.get("/vector/simple/search-filter")
}

export const vectorSave = () => {
  return request.get("/vector/simple/save")
}

export const vectorLoad = () => {
  return request.get("/vector/simple/load")
}

export const vectorDelete = () => {
  return request.get("/vector/simple/delete")
}

export const vectorAdd = () => {
  return request.get("/vector/simple/add")
}

// ==================== 测试接口 ====================

export const testApi = () => {
  return request.get("/test")
}

// ==================== 类型定义 ====================

export interface User {
  id: number
  username: string
  password?: string
  email: string
  role: string
  status: number
  createTime: string
  avatar_url?: string
}

export interface UserVo {
  id: number
  username: string
  email: string
  role: string
  avatarUrl: string
  status: number
  createTime: string
}

export interface Problem {
  id: number
  title: string
  description: string
  difficulty: number
  timeLimit: number
  memoryLimit: number
  status: number
  createTime: string
  testInput?: string
  testOutput?: string
}

export interface ProblemBriefVo {
  id: number
  title: string
  description: string
  difficulty: number
  timeLimit: number
  memoryLimit: number
  status: number
  createTime: string
  acceptedCount: number
  submissionCount: number
  tags: ProblemTag[]
}

export interface ProblemTag {
  id: number
  color: string
  description: string
  name: string
}

export interface ProblemCase {
  id: number
  problemId: number
  input: string
  output: string
}

export interface Submission {
  id: number
  problemId: number
  userId: number
  language: string
  code: string
  status: string
  runtime: number
  memory: number
  createTime: string
  failMsg?: string
  input?: string
  output?: string
  expectedOutput?: string
  contestId?: number
}

export interface Solution {
  id: number
  problemId: number
  userId: number
  title: string
  content: string
  createTime: string
  updateTime: string
  likes: number
  status: number
  msg?: string
}

export interface Contest {
  id: number
  title: string
  description: string
  createTime: string
  startTime: string
  endTime: string
  duration: number
  penaltyConstant: number
}

export interface ContestProblemBrief {
  id: number
  title: string
  description: string
  difficulty: number
  problemSeq: number
}

export interface MessageBelong {
  id: number
  title: string
  userId: number
  createTime: string
}

export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
  map?: Record<string, any>
}

export default request
