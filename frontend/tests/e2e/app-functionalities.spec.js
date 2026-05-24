import { test, expect } from '@playwright/test';

const API_HOST = 'http://localhost:5000';
const VALID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQxMDI0NDQ4MDAsImlkIjoidTEiLCJlbWFpbCI6InBsYXl3cmlnaHRAZXhhbXBsZS5jb20ifQ.signature';

const createMockApi = async (page) => {
  const currentUser = {
    _id: 'u1',
    name: 'Playwright User',
    email: 'playwright@example.com',
    profileImage: '',
    about: 'E2E profile',
    tags: ['react', 'node'],
    friends: [],
    joinedOn: new Date().toISOString(),
    subscription: 'free',
  };

  const data = {
    users: [currentUser],
    questions: [
      {
        _id: 'q1',
        questionTitle: 'How to test this app?',
        questionBody: 'Need E2E coverage',
        questionTags: ['testing', 'playwright'],
        noOfAnswers: 0,
        upVote: [],
        downVote: [],
        userPosted: 'Playwright User',
        userId: 'u1',
        askedOn: new Date().toISOString(),
        answer: [],
      },
    ],
    posts: [
      {
        _id: 'p1',
        userId: 'u1',
        name: 'Playwright User',
        desc: 'Initial post from mock API',
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      },
    ],
  };

  const json = (status, payload) => ({
    status,
    contentType: 'application/json',
    body: JSON.stringify(payload),
  });

  await page.route(`${API_HOST}/**`, async (route) => {
    const req = route.request();
    const method = req.method();
    const url = new URL(req.url());
    const pathname = url.pathname;
    const bodyText = req.postData();
    const body = bodyText ? JSON.parse(bodyText) : {};

    if (method === 'GET' && pathname === '/') {
      return route.fulfill({ status: 200, body: 'Mock API online' });
    }

    if (method === 'POST' && pathname === '/user/signup') {
      const responseUser = {
        ...currentUser,
        name: body.name || currentUser.name,
        email: body.email || currentUser.email,
      };
      data.users[0] = responseUser;
      return route.fulfill(json(200, { token: VALID_TOKEN, result: responseUser }));
    }

    if (method === 'POST' && pathname === '/user/login') {
      return route.fulfill(json(200, { token: VALID_TOKEN, result: data.users[0] }));
    }

    if (method === 'GET' && pathname === '/user/getAllUsers') {
      return route.fulfill(json(200, data.users));
    }

    if (method === 'PATCH' && pathname.startsWith('/user/update/')) {
      data.users[0] = {
        ...data.users[0],
        name: body.name || data.users[0].name,
        about: body.about || data.users[0].about,
        tags: body.tags || data.users[0].tags,
      };
      return route.fulfill(json(200, data.users[0]));
    }

    if (method === 'PATCH' && (pathname === '/user/friend' || pathname === '/user/unfriend')) {
      return route.fulfill(json(200, data.users[0]));
    }

    if (method === 'POST' && pathname === '/user/send-otp') {
      return route.fulfill(json(200, { message: 'OTP sent' }));
    }

    if (method === 'POST' && pathname === '/user/verify-otp') {
      return route.fulfill(json(200, { message: 'OTP verified' }));
    }

    if (method === 'POST' && pathname === '/user/forgot-password') {
      return route.fulfill(json(200, { message: 'Reset OTP sent' }));
    }

    if (method === 'POST' && pathname === '/user/forgot-password/verify-otp') {
      return route.fulfill(json(200, { message: 'Reset OTP verified' }));
    }

    if (method === 'POST' && pathname === '/user/forgot-password/reset-password') {
      return route.fulfill(json(200, { message: 'Password reset' }));
    }

    if (method === 'GET' && pathname === '/questions/get') {
      return route.fulfill(json(200, data.questions));
    }

    if (method === 'POST' && pathname === '/questions/Ask') {
      const newQuestion = {
        _id: `q${Date.now()}`,
        questionTitle: body.questionTitle,
        questionBody: body.questionBody,
        questionTags: body.questionTags || [],
        noOfAnswers: 0,
        upVote: [],
        downVote: [],
        userPosted: body.userPosted || 'Playwright User',
        userId: body.userId || 'u1',
        askedOn: new Date().toISOString(),
        answer: [],
      };
      data.questions.unshift(newQuestion);
      return route.fulfill(json(200, { message: 'Posted a question successfully' }));
    }

    if (method === 'PATCH' && pathname.startsWith('/questions/vote/')) {
      return route.fulfill(json(200, { message: 'vote successfully..' }));
    }

    if (method === 'DELETE' && pathname.startsWith('/questions/delete/')) {
      const id = pathname.split('/').pop();
      data.questions = data.questions.filter((q) => q._id !== id);
      return route.fulfill(json(200, { message: 'successfully deleted...' }));
    }

    if (method === 'PATCH' && pathname.startsWith('/answer/post/')) {
      return route.fulfill(json(200, { message: 'answer posted' }));
    }

    if (method === 'PATCH' && pathname.startsWith('/answer/delete/')) {
      return route.fulfill(json(200, { message: 'answer deleted' }));
    }

    if (method === 'GET' && pathname === '/post/get') {
      return route.fulfill(json(200, data.posts));
    }

    if (method === 'GET' && pathname.startsWith('/post/user-posts/')) {
      const userId = pathname.split('/').pop();
      return route.fulfill(json(200, data.posts.filter((p) => p.userId === userId)));
    }

    if (method === 'POST' && pathname === '/post/add') {
      const newPost = {
        _id: `p${Date.now()}`,
        userId: body.userId || 'u1',
        name: body.name || 'Playwright User',
        desc: body.desc || '',
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };
      data.posts.unshift(newPost);
      return route.fulfill(json(201, { success: true, Post: newPost }));
    }

    if (method === 'PATCH' && pathname.startsWith('/post/like/')) {
      return route.fulfill(json(200, { success: true }));
    }

    if (method === 'PATCH' && pathname.startsWith('/post/dislike/')) {
      return route.fulfill(json(200, { success: true }));
    }

    if (method === 'PATCH' && pathname.startsWith('/post/add-comment/')) {
      return route.fulfill(
        json(201, {
          commentId: `c${Date.now()}`,
          userId: body.userId || 'u1',
          content: body.content || 'comment',
          name: body.name || 'Playwright User',
        })
      );
    }

    if (method === 'DELETE' && pathname.startsWith('/post/delete-comment/')) {
      return route.fulfill(json(200, { message: 'Comment deleted successfully' }));
    }

    if (method === 'POST' && pathname === '/post/upload-media') {
      return route.fulfill(json(200, { success: true, result: { secure_url: 'https://example.com/mock.png' } }));
    }

    if (method === 'GET' && pathname.startsWith('/subscription/check-subscription/')) {
      return route.fulfill(json(200, { subs: 'same' }));
    }

    if (method === 'POST' && pathname === '/subscription/order') {
      return route.fulfill(
        json(200, {
          success: true,
          order: { id: `order_${Date.now()}`, amount: 10000, currency: 'INR' },
        })
      );
    }

    if (method === 'POST' && pathname === '/subscription/is-order-complete') {
      return route.fulfill(json(200, { success: true }));
    }

    if (method === 'POST' && pathname === '/chat/add') {
      return route.fulfill(
        json(200, {
          success: true,
          assistant: 'Hello - QuereeGPT here, your mock response is ready.',
        })
      );
    }

    return route.fulfill(json(200, { mocked: true, method, pathname }));
  });

  return { currentUser };
};

const setAuthenticatedProfile = async (page, user) => {
  await page.addInitScript((profile) => {
    localStorage.setItem('Profile', JSON.stringify(profile));
  }, { token: VALID_TOKEN, result: user });
};

test('guest sees chatbot button and gets login alert on click', async ({ page }) => {
  await createMockApi(page);
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Open chatbot' })).toBeVisible();
  await page.getByRole('button', { name: 'Open chatbot' }).click();
  await expect(page.getByText(/Authentication required/i)).toBeVisible();
});

test('chatbot launcher is hidden on login and signup pages', async ({ page }) => {
  await createMockApi(page);

  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Open chatbot' })).toHaveCount(0);

  await page.goto('/signup');
  await expect(page.getByRole('button', { name: 'Open chatbot' })).toHaveCount(0);
});

test('guest opening /Community gets login screen', async ({ page }) => {
  await createMockApi(page);
  await page.goto('/Community');
  await expect(page.getByText(/Welcome back! Log in/i)).toBeVisible();
});

test('login flow redirects to home and shows authenticated navbar', async ({ page }) => {
  await createMockApi(page);
  await page.goto('/login');

  await page.locator('#email').fill('playwright@example.com');
  await page.locator('#password').fill('Pass@12345');
  await page.getByRole('button', { name: 'Log In' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});

test('guest ask question redirects to login after alert', async ({ page }) => {
  await createMockApi(page);

  await page.goto('/AskQuestion');
  await page.locator('#ask-ques-title').fill('Test question');
  await page.locator('#ask-ques-body').fill('Some body text');
  await page.locator('#ask-ques-tags').fill('react testing');
  await page.getByRole('button', { name: 'Review your question' }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText(/Please log in to submit a question/i)).toBeVisible();
});

test('authenticated user can submit ask question flow', async ({ page }) => {
  const { currentUser } = await createMockApi(page);
  await setAuthenticatedProfile(page, currentUser);

  await page.goto('/AskQuestion');
  await page.locator('#ask-ques-title').fill('Playwright created question');
  await page.locator('#ask-ques-body').fill('Body from e2e test');
  await page.locator('#ask-ques-tags').fill('playwright e2e');
  await page.getByRole('button', { name: 'Review your question' }).click();

  await expect(page).toHaveURL(/\/$/);
});

test('users page renders community directory', async ({ page }) => {
  await createMockApi(page);
  await page.goto('/Users');

  await expect(page.getByRole('heading', { name: 'Community Directory' })).toBeVisible();
  await expect(page.getByText('Playwright User')).toBeVisible();
});

test('authenticated user can open chatbot and send message', async ({ page }) => {
  const { currentUser } = await createMockApi(page);
  await setAuthenticatedProfile(page, currentUser);

  await page.goto('/');
  await page.getByRole('button', { name: 'Open chatbot' }).click();

  const input = page.getByLabel('Diagnostic query input');
  await input.fill('hello from e2e');
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.getByText(/your mock response is ready/i).first()).toBeVisible();
});
