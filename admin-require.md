## 要求
## 技术
react shadn/ui axios

## 风格
leetcode 风格，暗色

## 接口
- 参考 lib/api 提供的 api
## 页面 
- 导航栏右侧按钮，触发登录/注册 弹框,创建一个新的component/admin/naviagation.jsx
- 出题
    - 创建题目
         参考 lib/api 提供的 api 支持 zip 提供样例数据
    - 修改题目
    - 删除题目
- 审核题解
    - 搜索题解
    - 修改题解
    - 删除题解
    - 审核题解
  - 题目
    - 搜索题目界面
    - 进入题目详情
      修改各个信息
```js
import axios from "axios"
import JSONbig from 'json-bigint';
const api_baseURL =  "http://localhost:9090/api"
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
  id: string,
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

export const getUserById = (userId: string | number) => {
  return request.get("/user/get", { params: { arg0: userId } })
}

export const searchUsers = (keyword: string) => {
  return request.get("/user/search", { params: { arg0: keyword } })
}

export const deleteUser = (userId: string | number) => {
  return request.get("/user/delete", { params: { arg0: userId } })
}

// ==================== 题目相关接口 ====================

export const searchProblems = (params: {
  titleKeyword?: string
  descriptionKeyword?: string
  tagName?: string
  tagId?: string
  pageNum?: number
  pageSize?: number
}) => {
  return request.get("/problem/search", { params })
}

export const getProblemDetail = (problemId: string | number) => {
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
  problemId: string | number
  userId: string | number
  language: string
  code: string
  status?: string
  runtime?: number
  memory?: number
  failMsg?: string
  input?: string
  output?: string
  expectedOutput?: string
  contestId?: string
}) => {
  return request.post("/problem/submit", submission)
}

export const getSubmissionCount = (problemId: string | number) => {
  return request.get("/problem/getSubmissionCount", { params: { problemId } })
}

export const getPassedCount = (problemId: string | number) => {
  return request.get("/problem/getPassedCount", { params: { problemId } })
}

// 管理员题目相关接口
export const updateProblem = (problemId: string | number, problemData: {
  title?: string
  description?: string
  difficulty?: number
  timeLimit?: number
  memoryLimit?: number
  status?: number
  testInput?: string
  testOutput?: string
}) => {
  return request.put(`/problem/${problemId}`, problemData)
}

export const deleteProblem = (problemId: string | number) => {
  return request.delete(`/problem/${problemId}`)
}

// ==================== 题目测试用例相关接口 ====================

export const getProblemCases = (problemId: string | number) => {
  return request.get("/problemCase/getProblemCases", { params: { problemId } })
}

export const uploadProblemCasesZip = (problemId: string | number, file: File) => {
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
  problemId: string
  userId: string
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
  problemId?: string
}) => {
  return request.get("/solution/search", { params })
}

export const getSolutionsByProblemId = (problemId: string | number, pageNum = 1, pageSize = 10) => {
  return request.get("/solution/getByProblemId", {
    params: { problemId, pageNum, pageSize },
  })
}

export const getSolutionDetail = (solutionId: string | number) => {
  return request.get("/solution/detail", { params: { solutionId } })
}

export const approveSolution = (solutionId: string | number) => {
  return request.get("/solution/approve", { params: { solutionId } })
}

export const rejectSolution = (solutionId: string | number) => {
  return request.get("/solution/reject", { params: { solutionId } })
}

// 管理员题解相关接口
export const updateSolution = (solutionId: string | number, solutionData: {
  title?: string
  content?: string
  status?: number
  msg?: string
}) => {
  return request.put(`/solution/${solutionId}`, solutionData)
}

export const deleteSolution = (solutionId: string | number) => {
  return request.delete(`/solution/${solutionId}`)
}

// ==================== 比赛相关接口 ====================

export const searchContests = (keyword: string, pageNum = 1, pageSize = 10) => {
  return request.get("/contest/searchContest", {
    params: { keyword, pageNum, pageSize },
  })
}

export const getContestProblems = (contestId: string | number) => {
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

export const deleteContest = (contestId: string | number) => {
  return request.get("/contest/deleteContest", { params: { contestId } })
}

export const addProblemToContest = (contestId: string | number, problemId: string | number) => {
  return request.get("/contest/addProblemToContest", {
    params: { contestId, problemId },
  })
}

// ==================== 聊天相关接口 ====================

export const newChat = (userId: string | number, title?: string) => {
  return request.get("/chat/new", { params: { userId, title } })
}
// 获取所有聊天记录的大概
export const getChatHistory = (userId: string | number) => {
  return request.get("/chat/getHistory", { params: { userId } })
}
//获得具体某次聊天记录
export const getMessage = (messageId: string | number)=>{
  return request.get("/chat/getMessages", { params: { messageId } })
}
export const streamChatSimple = (query?: string, stop = false) => {
  return request.get("/chat/stream/simple", { params: { query, stop } })
}
// 删除聊天记录
export const deleteChat = (messageId: string | number) => {
  return request.get("/chat/delete", { params: { messageId } })
}
// 修改聊天title
export const updateChatTitle = (params: {
  messageId: string | number
  title: string
}) => {
  return request.get("/chat/updateTitle", {params})
}
// delete content
export const deleteContent = (params: { contentId: string | number }) => {
  return request.get("/deleteContent", { params })
}
export const streamChatWithMemory = (params: {
  query?: string
  problemId?: string | number
  stop?: boolean
  messageId?: string | number
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

// ==================== 工具方法（聊天流式URL构建） ====================

export const getApiBase = () => api_baseURL

export const buildStreamChatMemoryUrl = (params: {
  query?: string
  problemId?: string | number
  stop?: boolean
  messageId?: string | number
} = {}) => {
  // 直接使用完整的 API 地址
  const url = new URL("http://localhost:9090/api/chat/stream/memory")
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  })
  console.log(url)
  return url.toString()
}

// ==================== 聊天备份相关接口 ====================

export const chatBackupTest = () => {
  return request.get("/chat-backup/test")
}

export const chatBackupStream = (query?: string, stop = false) => {
  return request.get("/chat-backup/stream", { params: { query, stop } })
}

export const chatBackupCall = (query?: string, problemId?: string) => {
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
  id: string
  username: string
  password?: string
  email: string
  role: string
  status: number
  createTime: string
  avatar_url?: string
}

export interface UserVo {
  id: string
  username: string
  email: string
  role: string
  avatarUrl: string
  status: number
  createTime: string
}

export interface Problem {
  id: string
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
  id: string
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
  id: string
  color: string
  description: string
  name: string
}

export interface ProblemCase {
  id: string
  problemId: string
  input: string
  output: string
}

export interface Submission {
  id: string
  problemId: string
  userId: string
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
  contestId?: string
}

export interface Solution {
  id: string
  problemId: string
  userId: string
  title: string
  content: string
  createTime: string
  updateTime: string
  likes: number
  status: number
  msg?: string
}

export interface Contest {
  id: string
  title: string
  description: string
  createTime: string
  startTime: string
  endTime: string
  duration: number
  penaltyConstant: number
}

export interface ContestProblemBrief {
  id: string
  title: string
  description: string
  difficulty: number
  problemSeq: number
}

export interface MessageBelong {
  id: string
  title: string
  userId: string
  createTime: string
}

export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
  map?: Record<string, any>
}

export default request
```