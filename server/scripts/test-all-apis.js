import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const OPTIONAL_IMAGE_PATH = process.env.TEST_IMAGE_PATH || '';
const OPTIONAL_VIDEO_PATH = process.env.TEST_VIDEO_PATH || '';
const OPTIONAL_OTP_EMAIL = process.env.TEST_OTP_EMAIL || '';
const OPTIONAL_OTP_CODE = process.env.TEST_OTP_CODE || '';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

const result = {
  passed: 0,
  failed: 0,
  skipped: 0,
  failures: [],
};

const state = {
  token: null,
  userId: null,
  questionId: null,
  answerId: null,
  postId: null,
  commentId: null,
};

const logPass = (name) => {
  result.passed += 1;
  console.log(`${colors.green}PASS${colors.reset} ${name}`);
};

const logFail = (name, message) => {
  result.failed += 1;
  result.failures.push({ name, message });
  console.log(`${colors.red}FAIL${colors.reset} ${name}`);
  console.log(`  ${message}`);
};

const logSkip = (name, reason) => {
  result.skipped += 1;
  console.log(`${colors.yellow}SKIP${colors.reset} ${name}`);
  console.log(`  ${reason}`);
};

const makeUrl = (endpoint) => `${BASE_URL.replace(/\/$/, '')}${endpoint}`;

const request = async (method, endpoint, options = {}) => {
  const headers = { ...(options.headers || {}) };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let body = options.body;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const res = await fetch(makeUrl(endpoint), {
    method,
    headers,
    body,
  });

  const text = await res.text();
  let data = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Keep raw text when response is not JSON.
  }

  return { ok: res.ok, status: res.status, data };
};

const runTest = async (name, fn) => {
  try {
    await fn();
    logPass(name);
  } catch (error) {
    logFail(name, error?.message || String(error));
  }
};

const expectOk = (res, label) => {
  if (!res.ok) {
    throw new Error(`${label} returned ${res.status}: ${JSON.stringify(res.data)}`);
  }
};

const readFileAsBlob = async (filePath, fallbackMime) => {
  const fileBuffer = await fs.readFile(filePath);
  return new Blob([fileBuffer], { type: fallbackMime });
};

const testUserLifecycle = async () => {
  const unique = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const email = `apitest_${unique}@example.com`;
  const password = 'Pass@12345';
  const name = `ApiTester_${unique}`;

  await runTest('GET /', async () => {
    const res = await request('GET', '/');
    expectOk(res, 'GET /');
  });

  await runTest('POST /user/signup', async () => {
    const res = await request('POST', '/user/signup', {
      body: { name, email, password },
    });
    expectOk(res, 'POST /user/signup');
    state.token = res.data?.token || null;
    state.userId = res.data?.result?._id || null;
    if (!state.token || !state.userId) {
      throw new Error('Signup did not return token and user id.');
    }
  });

  await runTest('POST /user/login', async () => {
    const res = await request('POST', '/user/login', {
      body: { email, password },
    });
    expectOk(res, 'POST /user/login');
    state.token = res.data?.token || state.token;
    state.userId = res.data?.result?._id || state.userId;
  });

  await runTest('GET /user/getAllUsers', async () => {
    const res = await request('GET', '/user/getAllUsers');
    expectOk(res, 'GET /user/getAllUsers');
  });

  await runTest('PATCH /user/update/:id', async () => {
    const res = await request('PATCH', `/user/update/${state.userId}`, {
      token: state.token,
      body: {
        name: `${name}_updated`,
        about: 'API smoke test profile',
        tags: ['node', 'express', 'smoke-test'],
      },
    });
    expectOk(res, 'PATCH /user/update/:id');
  });

  await runTest('PATCH /user/friend and /user/unfriend (self)', async () => {
    const addRes = await request('PATCH', '/user/friend', {
      token: state.token,
      body: { id: state.userId, userId: state.userId },
    });
    expectOk(addRes, 'PATCH /user/friend');

    const removeRes = await request('PATCH', '/user/unfriend', {
      token: state.token,
      body: { id: state.userId, userId: state.userId },
    });
    expectOk(removeRes, 'PATCH /user/unfriend');
  });

  if (!OPTIONAL_OTP_EMAIL || !OPTIONAL_OTP_CODE) {
    logSkip('POST /user/send-otp and /user/verify-otp', 'Set TEST_OTP_EMAIL and TEST_OTP_CODE to enable OTP flow test.');
  } else {
    await runTest('POST /user/send-otp', async () => {
      const res = await request('POST', '/user/send-otp', {
        body: { email: OPTIONAL_OTP_EMAIL },
      });
      expectOk(res, 'POST /user/send-otp');
    });

    await runTest('POST /user/verify-otp', async () => {
      const res = await request('POST', '/user/verify-otp', {
        body: { email: OPTIONAL_OTP_EMAIL, otp: OPTIONAL_OTP_CODE },
      });
      expectOk(res, 'POST /user/verify-otp');
    });
  }

  if (!OPTIONAL_IMAGE_PATH) {
    logSkip('POST /user/upload-profile', 'Set TEST_IMAGE_PATH to enable profile upload test.');
  } else {
    await runTest('POST /user/upload-profile', async () => {
      const imageBlob = await readFileAsBlob(path.resolve(OPTIONAL_IMAGE_PATH), 'image/png');
      const form = new FormData();
      form.append('file', imageBlob, path.basename(OPTIONAL_IMAGE_PATH));

      const res = await request('POST', '/user/upload-profile', {
        token: state.token,
        body: form,
      });
      expectOk(res, 'POST /user/upload-profile');
    });
  }
};

const testQuestionAnswerFlow = async () => {
  await runTest('POST /questions/Ask', async () => {
    const res = await request('POST', '/questions/Ask', {
      token: state.token,
      body: {
        questionTitle: `API test question ${Date.now()}`,
        questionBody: 'What is the expected response for smoke tests?',
        questionTags: ['api', 'test'],
        userPosted: 'Api Tester',
        userId: state.userId,
      },
    });
    expectOk(res, 'POST /questions/Ask');
  });

  await runTest('GET /questions/get', async () => {
    const res = await request('GET', '/questions/get');
    expectOk(res, 'GET /questions/get');
    const mine = Array.isArray(res.data)
      ? res.data.find((q) => q.userId === state.userId)
      : null;
    if (!mine?._id) {
      throw new Error('Could not find created question in /questions/get.');
    }
    state.questionId = mine._id;
  });

  await runTest('PATCH /questions/vote/:id', async () => {
    const res = await request('PATCH', `/questions/vote/${state.questionId}`, {
      token: state.token,
      body: { value: 'upVote', userId: state.userId },
    });
    expectOk(res, 'PATCH /questions/vote/:id');
  });

  await runTest('PATCH /answer/post/:id', async () => {
    const res = await request('PATCH', `/answer/post/${state.questionId}`, {
      token: state.token,
      body: {
        noOfAnswers: 1,
        answerBody: 'This is an API smoke test answer.',
        userAnswered: 'Api Tester',
        userId: state.userId,
      },
    });
    expectOk(res, 'PATCH /answer/post/:id');
  });

  await runTest('Locate answer id', async () => {
    const res = await request('GET', '/questions/get');
    expectOk(res, 'GET /questions/get (locate answer)');
    const q = Array.isArray(res.data)
      ? res.data.find((item) => item._id === state.questionId)
      : null;
    const answer = q?.answer?.[0];
    if (!answer?._id) {
      throw new Error('Could not locate posted answer id.');
    }
    state.answerId = answer._id;
  });

  await runTest('PATCH /answer/delete/:id', async () => {
    const res = await request('PATCH', `/answer/delete/${state.questionId}`, {
      token: state.token,
      body: { answerId: state.answerId, noOfAnswers: 0 },
    });
    expectOk(res, 'PATCH /answer/delete/:id');
  });

  await runTest('DELETE /questions/delete/:id', async () => {
    const res = await request('DELETE', `/questions/delete/${state.questionId}`, {
      token: state.token,
    });
    expectOk(res, 'DELETE /questions/delete/:id');
  });
};

const testPostFlow = async () => {
  await runTest('POST /post/add', async () => {
    const res = await request('POST', '/post/add', {
      token: state.token,
      body: {
        userId: state.userId,
        name: 'Api Tester',
        desc: `API test post ${Date.now()}`,
      },
    });
    expectOk(res, 'POST /post/add');
  });

  await runTest('GET /post/get', async () => {
    const res = await request('GET', '/post/get');
    expectOk(res, 'GET /post/get');
    const mine = Array.isArray(res.data)
      ? res.data.find((p) => p.userId === state.userId)
      : null;
    if (!mine?._id) {
      throw new Error('Could not find created post in /post/get.');
    }
    state.postId = mine._id;
  });

  await runTest('GET /post/user-posts/:id', async () => {
    const res = await request('GET', `/post/user-posts/${state.userId}`);
    expectOk(res, 'GET /post/user-posts/:id');
  });

  await runTest('PATCH /post/like/:id', async () => {
    const res = await request('PATCH', `/post/like/${state.postId}`, {
      token: state.token,
      body: { userId: state.userId },
    });
    expectOk(res, 'PATCH /post/like/:id');
  });

  await runTest('PATCH /post/dislike/:id', async () => {
    const res = await request('PATCH', `/post/dislike/${state.postId}`, {
      token: state.token,
      body: { userId: state.userId },
    });
    expectOk(res, 'PATCH /post/dislike/:id');
  });

  await runTest('PATCH /post/add-comment/:id', async () => {
    const res = await request('PATCH', `/post/add-comment/${state.postId}`, {
      token: state.token,
      body: {
        postId: state.postId,
        userId: state.userId,
        content: 'API smoke test comment',
        name: 'Api Tester',
      },
    });
    expectOk(res, 'PATCH /post/add-comment/:id');
    state.commentId = res.data?.commentId || null;
    if (!state.commentId) {
      throw new Error('Comment id not returned from /post/add-comment/:id');
    }
  });

  await runTest('DELETE /post/delete-comment/:id', async () => {
    const res = await request('DELETE', `/post/delete-comment/${state.postId}`, {
      token: state.token,
      body: { postId: state.postId, commentId: state.commentId },
    });
    expectOk(res, 'DELETE /post/delete-comment/:id');
  });

  if (!OPTIONAL_IMAGE_PATH && !OPTIONAL_VIDEO_PATH) {
    logSkip('POST /post/upload-media', 'Set TEST_IMAGE_PATH or TEST_VIDEO_PATH to enable media upload test.');
  } else {
    await runTest('POST /post/upload-media', async () => {
      const filePath = OPTIONAL_VIDEO_PATH || OPTIONAL_IMAGE_PATH;
      const fallbackMime = OPTIONAL_VIDEO_PATH ? 'video/mp4' : 'image/png';
      const blob = await readFileAsBlob(path.resolve(filePath), fallbackMime);
      const form = new FormData();
      form.append('file', blob, path.basename(filePath));

      const res = await request('POST', '/post/upload-media', {
        token: state.token,
        body: form,
      });
      expectOk(res, 'POST /post/upload-media');
    });
  }
};

const testSubscriptionAndChat = async () => {
  await runTest('GET /subscription/check-subscription/:userId', async () => {
    const res = await request('GET', `/subscription/check-subscription/${state.userId}`, {
      token: state.token,
    });
    expectOk(res, 'GET /subscription/check-subscription/:userId');
  });

  await runTest('POST /subscription/order', async () => {
    const res = await request('POST', '/subscription/order', {
      token: state.token,
      body: { amount: 100 },
    });

    // This endpoint can fail when Razorpay credentials are missing; treat as optional integration.
    if (!res.ok) {
      logSkip('POST /subscription/order', `Optional integration failed (${res.status}). Configure KEY_ID and KEY_SECRET to enable.`);
      return;
    }

    if (!res.data?.order?.id) {
      throw new Error('Subscription order response missing order id.');
    }
  });

  await runTest('POST /chat/add', async () => {
    const res = await request('POST', '/chat/add', {
      body: { message: 'Respond with one short line for API smoke test.' },
    });

    // Chat proxy may fail when Gemini key/network is unavailable.
    if (!res.ok) {
      logSkip('POST /chat/add', `Optional integration failed (${res.status}). Configure GEMINI_API_KEY and network access.`);
      return;
    }

    if (!res.data?.assistant) {
      throw new Error('Chat response missing assistant message.');
    }
  });
};

const main = async () => {
  console.log(`${colors.cyan}Server API smoke test starting against ${BASE_URL}${colors.reset}`);
  console.log('Ensure the server is already running before executing this script.');
  console.log('');

  await testUserLifecycle();
  await testQuestionAnswerFlow();
  await testPostFlow();
  await testSubscriptionAndChat();

  console.log('');
  console.log(`${colors.cyan}Summary${colors.reset}`);
  console.log(`  Passed : ${result.passed}`);
  console.log(`  Failed : ${result.failed}`);
  console.log(`  Skipped: ${result.skipped}`);

  if (result.failures.length > 0) {
    console.log('');
    console.log(`${colors.red}Failure details${colors.reset}`);
    result.failures.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name}`);
      console.log(`     ${item.message}`);
    });
    process.exit(1);
  }

  process.exit(0);
};

main().catch((error) => {
  console.error(`${colors.red}Fatal error${colors.reset}`, error);
  process.exit(1);
});
