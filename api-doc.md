# OpenAPI definition


**简介**:OpenAPI definition


**HOST**:http://bc.agiantii.top:9090/api


**联系人**:


**Version**:v0


**接口路径**:/api/v3/api-docs


[TOC]






# user-controller


## updateUser


**接口地址**:`/api/user/{id}`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0,
  "username": "",
  "password": "",
  "email": "",
  "role": "",
  "status": 0,
  "createTime": "",
  "avatar_url": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|user|User|body|true|User|User|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;username|||false|string||
|&emsp;&emsp;password|||false|string||
|&emsp;&emsp;email|||false|string||
|&emsp;&emsp;role|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;avatar_url|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RVoid|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||object||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {},
	"map": {}
}
```


## login


**接口地址**:`/api/user/login`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|arg0||query|true|string||
|arg1||query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": "",
	"map": {}
}
```


## createUser


**接口地址**:`/api/user/add`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0,
  "username": "",
  "password": "",
  "email": "",
  "role": "",
  "status": 0,
  "createTime": "",
  "avatar_url": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|user|User|body|true|User|User|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;username|||false|string||
|&emsp;&emsp;password|||false|string||
|&emsp;&emsp;email|||false|string||
|&emsp;&emsp;role|||false|string||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;avatar_url|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RVoid|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||object||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {},
	"map": {}
}
```


## findUserByUsername


**接口地址**:`/api/user/search`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|arg0||query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RListUserVo|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|UserVo|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;username||string||
|&emsp;&emsp;email||string||
|&emsp;&emsp;role||string||
|&emsp;&emsp;avatarUrl||string||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;createTime||string||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"id": 0,
			"username": "",
			"email": "",
			"role": "",
			"avatarUrl": "",
			"status": 0,
			"createTime": ""
		}
	],
	"map": {}
}
```


## getUserById


**接口地址**:`/api/user/get`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|arg0||query|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RUser|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||User|User|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;username||string||
|&emsp;&emsp;password||string||
|&emsp;&emsp;email||string||
|&emsp;&emsp;role||string||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;avatar_url||string||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"id": 0,
		"username": "",
		"password": "",
		"email": "",
		"role": "",
		"status": 0,
		"createTime": "",
		"avatar_url": ""
	},
	"map": {}
}
```


## deleteUser


**接口地址**:`/api/user/delete`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|arg0||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RVoid|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||object||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {},
	"map": {}
}
```


# solution-controller


## addSolution


**接口地址**:`/api/solution/add`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0,
  "problemId": 0,
  "userId": 0,
  "title": "",
  "content": "",
  "createTime": "",
  "updateTime": "",
  "likes": 0,
  "status": 0,
  "msg": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|solution|Solution|body|true|Solution|Solution|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;problemId|||false|integer(int64)||
|&emsp;&emsp;userId|||false|integer(int64)||
|&emsp;&emsp;title|||false|string||
|&emsp;&emsp;content|||false|string||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;updateTime|||false|string(date-time)||
|&emsp;&emsp;likes|||false|integer(int32)||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;msg|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RLong|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||integer(int64)|integer(int64)|
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": 0,
	"map": {}
}
```


## searchSolution


**接口地址**:`/api/solution/search`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|keyword||query|true|string||
|visible||query|true|integer(int32)||
|pageNum||query|true|integer(int32)||
|pageSize||query|true|integer(int32)||
|problemId||query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RListSolution|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|Solution|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;problemId||integer(int64)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;content||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;likes||integer(int32)||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;msg||string||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"id": 0,
			"problemId": 0,
			"userId": 0,
			"title": "",
			"content": "",
			"createTime": "",
			"updateTime": "",
			"likes": 0,
			"status": 0,
			"msg": ""
		}
	],
	"map": {}
}
```


## deleteSolution


**接口地址**:`/api/solution/reject`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|solutionId||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RInteger|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||integer(int32)|integer(int32)|
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": 0,
	"map": {}
}
```


## getSolutionsByProblemId


**接口地址**:`/api/solution/getByProblemId`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|problemId||query|true|integer(int64)||
|pageNum||query|false|integer(int32)||
|pageSize||query|false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RListSolution|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|Solution|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;problemId||integer(int64)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;content||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;updateTime||string(date-time)||
|&emsp;&emsp;likes||integer(int32)||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;msg||string||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"id": 0,
			"problemId": 0,
			"userId": 0,
			"title": "",
			"content": "",
			"createTime": "",
			"updateTime": "",
			"likes": 0,
			"status": 0,
			"msg": ""
		}
	],
	"map": {}
}
```


## approveSolution


**接口地址**:`/api/solution/approve`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|solutionId||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RInteger|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||integer(int32)|integer(int32)|
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": 0,
	"map": {}
}
```


# problem-case-controller


## uploadZip


**接口地址**:`/api/problemCase/uploadZip`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|problemId||query|true|integer(int64)||
|file||query|true|file||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": "",
	"map": {}
}
```


## getProblemCases


**接口地址**:`/api/problemCase/getProblemCases`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|problemId||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RListProblemCase|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|ProblemCase|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;problemId||integer(int64)||
|&emsp;&emsp;input||string||
|&emsp;&emsp;output||string||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"id": 0,
			"problemId": 0,
			"input": "",
			"output": ""
		}
	],
	"map": {}
}
```


# problem-controller


## submitProblem


**接口地址**:`/api/problem/submit`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0,
  "problemId": 0,
  "userId": 0,
  "language": "",
  "code": "",
  "status": "",
  "runtime": 0,
  "memory": 0,
  "createTime": "",
  "failMsg": "",
  "input": "",
  "output": "",
  "expectedOutput": "",
  "contestId": 0
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|submission|Submission|body|true|Submission|Submission|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;problemId|||false|integer(int64)||
|&emsp;&emsp;userId|||false|integer(int64)||
|&emsp;&emsp;language|||false|string||
|&emsp;&emsp;code|||false|string||
|&emsp;&emsp;status|||false|string||
|&emsp;&emsp;runtime|||false|integer(int32)||
|&emsp;&emsp;memory|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;failMsg|||false|string||
|&emsp;&emsp;input|||false|string||
|&emsp;&emsp;output|||false|string||
|&emsp;&emsp;expectedOutput|||false|string||
|&emsp;&emsp;contestId|||false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RLong|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||integer(int64)|integer(int64)|
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": 0,
	"map": {}
}
```


## createProblem


**接口地址**:`/api/problem/add`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求示例**:


```javascript
{
  "id": 0,
  "title": "",
  "description": "",
  "difficulty": 0,
  "timeLimit": 0,
  "memoryLimit": 0,
  "status": 0,
  "createTime": "",
  "testInput": "",
  "testOutput": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|problem|Problem|body|true|Problem|Problem|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;title|||false|string||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;difficulty|||false|integer(int32)||
|&emsp;&emsp;timeLimit|||false|integer(int64)||
|&emsp;&emsp;memoryLimit|||false|integer(int64)||
|&emsp;&emsp;status|||false|integer(int32)||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;testInput|||false|string||
|&emsp;&emsp;testOutput|||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RLong|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||integer(int64)|integer(int64)|
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": 0,
	"map": {}
}
```


## searchProblem


**接口地址**:`/api/problem/search`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|titleKeyword||query|false|string||
|descriptionKeyword||query|false|string||
|tagName||query|false|string||
|tagId||query|false|integer(int64)||
|pageNum||query|false|integer(int32)||
|pageSize||query|false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RListProblemBriefVo|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|ProblemBriefVo|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;description||string||
|&emsp;&emsp;difficulty||integer(int32)||
|&emsp;&emsp;timeLimit||integer(int64)||
|&emsp;&emsp;memoryLimit||integer(int64)||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;acceptedCount||integer(int32)||
|&emsp;&emsp;submissionCount||integer(int32)||
|&emsp;&emsp;tags||array|ProblemTag|
|&emsp;&emsp;&emsp;&emsp;id||integer||
|&emsp;&emsp;&emsp;&emsp;color||string||
|&emsp;&emsp;&emsp;&emsp;description||string||
|&emsp;&emsp;&emsp;&emsp;name||string||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"id": 0,
			"title": "",
			"description": "",
			"difficulty": 0,
			"timeLimit": 0,
			"memoryLimit": 0,
			"status": 0,
			"createTime": "",
			"acceptedCount": 0,
			"submissionCount": 0,
			"tags": [
				{
					"id": 0,
					"color": "",
					"description": "",
					"name": ""
				}
			]
		}
	],
	"map": {}
}
```


## getSubmissionCount


**接口地址**:`/api/problem/getSubmissionCount`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|problemId||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RInteger|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||integer(int32)|integer(int32)|
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": 0,
	"map": {}
}
```


## getPassedCount


**接口地址**:`/api/problem/getPassedCount`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|problemId||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RInteger|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||integer(int32)|integer(int32)|
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": 0,
	"map": {}
}
```


## getProblemDetail


**接口地址**:`/api/problem/detail`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|problemId||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RProblem|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||Problem|Problem|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;description||string||
|&emsp;&emsp;difficulty||integer(int32)||
|&emsp;&emsp;timeLimit||integer(int64)||
|&emsp;&emsp;memoryLimit||integer(int64)||
|&emsp;&emsp;status||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;testInput||string||
|&emsp;&emsp;testOutput||string||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"id": 0,
		"title": "",
		"description": "",
		"difficulty": 0,
		"timeLimit": 0,
		"memoryLimit": 0,
		"status": 0,
		"createTime": "",
		"testInput": "",
		"testOutput": ""
	},
	"map": {}
}
```


# image-controller


## uploadImage


**接口地址**:`/api/image/upload`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|file||query|true|file||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": "",
	"map": {}
}
```


# vector-simple-controller


## search


**接口地址**:`/api/vector/simple/search`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Document|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|content||string||
|id||string||
|text||string||
|media||Media|Media|
|&emsp;&emsp;id||string||
|&emsp;&emsp;mimeType||MimeType|MimeType|
|&emsp;&emsp;&emsp;&emsp;type||string||
|&emsp;&emsp;&emsp;&emsp;subtype||string||
|&emsp;&emsp;&emsp;&emsp;parameters||object||
|&emsp;&emsp;&emsp;&emsp;wildcardType||boolean||
|&emsp;&emsp;&emsp;&emsp;wildcardSubtype||boolean||
|&emsp;&emsp;&emsp;&emsp;subtypeSuffix||string||
|&emsp;&emsp;&emsp;&emsp;concrete||boolean||
|&emsp;&emsp;&emsp;&emsp;charset||string||
|&emsp;&emsp;data||object||
|&emsp;&emsp;name||string||
|&emsp;&emsp;dataAsByteArray||array|string(byte)|
|metadata||object||
|score||number(double)|number(double)|


**响应示例**:
```javascript
[
	{
		"content": "",
		"id": "",
		"text": "",
		"media": {
			"id": "",
			"mimeType": {
				"type": "",
				"subtype": "",
				"parameters": {},
				"wildcardType": true,
				"wildcardSubtype": true,
				"subtypeSuffix": "",
				"concrete": true,
				"charset": ""
			},
			"data": {},
			"name": "",
			"dataAsByteArray": []
		},
		"metadata": {},
		"score": 0
	}
]
```


## searchFilter


**接口地址**:`/api/vector/simple/search-filter`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|Document|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|content||string||
|id||string||
|text||string||
|media||Media|Media|
|&emsp;&emsp;id||string||
|&emsp;&emsp;mimeType||MimeType|MimeType|
|&emsp;&emsp;&emsp;&emsp;type||string||
|&emsp;&emsp;&emsp;&emsp;subtype||string||
|&emsp;&emsp;&emsp;&emsp;parameters||object||
|&emsp;&emsp;&emsp;&emsp;wildcardType||boolean||
|&emsp;&emsp;&emsp;&emsp;wildcardSubtype||boolean||
|&emsp;&emsp;&emsp;&emsp;subtypeSuffix||string||
|&emsp;&emsp;&emsp;&emsp;concrete||boolean||
|&emsp;&emsp;&emsp;&emsp;charset||string||
|&emsp;&emsp;data||object||
|&emsp;&emsp;name||string||
|&emsp;&emsp;dataAsByteArray||array|string(byte)|
|metadata||object||
|score||number(double)|number(double)|


**响应示例**:
```javascript
[
	{
		"content": "",
		"id": "",
		"text": "",
		"media": {
			"id": "",
			"mimeType": {
				"type": "",
				"subtype": "",
				"parameters": {},
				"wildcardType": true,
				"wildcardSubtype": true,
				"subtypeSuffix": "",
				"concrete": true,
				"charset": ""
			},
			"data": {},
			"name": "",
			"dataAsByteArray": []
		},
		"metadata": {},
		"score": 0
	}
]
```


## save


**接口地址**:`/api/vector/simple/save`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## load


**接口地址**:`/api/vector/simple/load`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## delete


**接口地址**:`/api/vector/simple/delete`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## add


**接口地址**:`/api/vector/simple/add`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# test


## test


**接口地址**:`/api/test`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|JSONArray|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|config||JSONConfig|JSONConfig|
|&emsp;&emsp;keyComparator||object||
|&emsp;&emsp;ignoreError||boolean||
|&emsp;&emsp;ignoreCase||boolean||
|&emsp;&emsp;dateFormat||string||
|&emsp;&emsp;ignoreNullValue||boolean||
|&emsp;&emsp;transientSupport||boolean||
|&emsp;&emsp;stripTrailingZeros||boolean||
|&emsp;&emsp;checkDuplicate||boolean||
|&emsp;&emsp;order||boolean||
|dateFormat||array||
|empty||boolean||


**响应示例**:
```javascript
{
	"config": {
		"keyComparator": {},
		"ignoreError": true,
		"ignoreCase": true,
		"dateFormat": "",
		"ignoreNullValue": true,
		"transientSupport": true,
		"stripTrailingZeros": true,
		"checkDuplicate": true,
		"order": true
	},
	"dateFormat": [],
	"empty": true
}
```


# submission-controller


## getSubmission


**接口地址**:`/api/submit/getStatus`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|submissionId||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RSubmission|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||Submission|Submission|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;problemId||integer(int64)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;language||string||
|&emsp;&emsp;code||string||
|&emsp;&emsp;status||string||
|&emsp;&emsp;runtime||integer(int32)||
|&emsp;&emsp;memory||integer(int32)||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;failMsg||string||
|&emsp;&emsp;input||string||
|&emsp;&emsp;output||string||
|&emsp;&emsp;expectedOutput||string||
|&emsp;&emsp;contestId||integer(int64)||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": {
		"id": 0,
		"problemId": 0,
		"userId": 0,
		"language": "",
		"code": "",
		"status": "",
		"runtime": 0,
		"memory": 0,
		"createTime": "",
		"failMsg": "",
		"input": "",
		"output": "",
		"expectedOutput": "",
		"contestId": 0
	},
	"map": {}
}
```


# contest-controller


## searchContest


**接口地址**:`/api/contest/searchContest`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|keyword||query|true|string||
|pageNum||query|true|integer(int32)||
|pageSize||query|true|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RListContest|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|Contest|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;description||string||
|&emsp;&emsp;createTime||string(date-time)||
|&emsp;&emsp;startTime||string(date-time)||
|&emsp;&emsp;endTime||string(date-time)||
|&emsp;&emsp;duration||integer(int32)||
|&emsp;&emsp;penaltyConstant||integer(int32)||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"id": 0,
			"title": "",
			"description": "",
			"createTime": "",
			"startTime": "",
			"endTime": "",
			"duration": 0,
			"penaltyConstant": 0
		}
	],
	"map": {}
}
```


## getContestProblems


**接口地址**:`/api/contest/getContestProblems`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|contestId||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RListContestProblemBrief|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|ContestProblemBrief|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;description||string||
|&emsp;&emsp;difficulty||integer(int32)||
|&emsp;&emsp;problemSeq||integer(int32)||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"id": 0,
			"title": "",
			"description": "",
			"difficulty": 0,
			"problemSeq": 0
		}
	],
	"map": {}
}
```


## deleteContest


**接口地址**:`/api/contest/deleteContest`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|contestId||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": "",
	"map": {}
}
```


## addProblemToContest


**接口地址**:`/api/contest/addProblemToContest`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|contestId||query|true|integer(int64)||
|problemId||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": "",
	"map": {}
}
```


## addContest


**接口地址**:`/api/contest/addContest`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|arg0||query|true|Contest|Contest|
|&emsp;&emsp;id|||false|integer(int64)||
|&emsp;&emsp;title|||false|string||
|&emsp;&emsp;description|||false|string||
|&emsp;&emsp;createTime|||false|string(date-time)||
|&emsp;&emsp;startTime|||false|string(date-time)||
|&emsp;&emsp;endTime|||false|string(date-time)||
|&emsp;&emsp;duration|||false|integer(int32)||
|&emsp;&emsp;penaltyConstant|||false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RString|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||string||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": "",
	"map": {}
}
```


# chat-controller


## stream


**接口地址**:`/api/chat/stream/simple`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|query||query|false|string||
|stop||query|false|boolean||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## chatRagAdvisor


**接口地址**:`/api/chat/stream/memory`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|query||query|false|string||
|problemId||query|false|integer(int64)||
|stop||query|false|boolean||
|messageId||query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## newChat


**接口地址**:`/api/chat/new`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId||query|true|integer(int64)||
|title||query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RLong|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||integer(int64)|integer(int64)|
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": 0,
	"map": {}
}
```


## getHistory


**接口地址**:`/api/chat/getHistory`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId||query|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|RListMessageBelong|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code||integer(int32)|integer(int32)|
|msg||string||
|data||array|MessageBelong|
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;createTime||string(date-time)||
|map||object||


**响应示例**:
```javascript
{
	"code": 0,
	"msg": "",
	"data": [
		{
			"id": 0,
			"title": "",
			"userId": 0,
			"createTime": ""
		}
	],
	"map": {}
}
```


## chatRagAdvisorBackup


**接口地址**:`/api/chat/chat-rag-advisor-backup`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|query||query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## chat


**接口地址**:`/api/chat/call`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|query||query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## add_1


**接口地址**:`/api/chat/add`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# chat-back-up-controller


## test_1


**接口地址**:`/api/chat-backup/test`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## stream_1


**接口地址**:`/api/chat-backup/stream`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`text/event-stream`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|query||query|false|string||
|stop||query|false|boolean||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


## call


**接口地址**:`/api/chat-backup/call`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|query||query|false|string||
|problem_id||query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```