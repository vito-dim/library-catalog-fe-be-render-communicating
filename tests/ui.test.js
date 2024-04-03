const { expect, test } = require('@playwright/test');
let fePage = 'http://localhost:3000',
    appUser = 'peter@abv.bg',
    appPassword = '123456',
    bookTitleTest = 'Lord of the rings',
    bookDescriptionTest = 'Magical saga',
    bookImageTest = 'https://example.com/book-image.jpg',
    bookTypeTest = 'Fiction',
    mailRegistration = Math.random().toString(36).substring(2,11) + '@abv.bg',
    mailRegistrationPass = '123456';

// I. Tests before Login
// Test 1:
test('Verify "All Books" link is visible', async ({page}) => {
    await page.goto(fePage);
    await page.waitForSelector("nav.navbar");
    const allBooksLink = await page.$('a[href="/catalog"]');
    const isAllBooksLinkVisible = await allBooksLink.isVisible();
    expect(isAllBooksLinkVisible).toBe(true);
})
// Test 2:
test('Verify "Login button" is visible', async ({page}) => {
    await page.goto(fePage);
    await page.waitForSelector("nav.navbar");
    const loginButton = await page.$('a[href="/login"]');
    const isLoginButtonVisible = await loginButton.isVisible();
    expect(isLoginButtonVisible).toBe(true);
})
// Test 2.1:
test('Verify "Register button" is visible', async ({page}) => {
    await page.goto(fePage);
    await page.waitForSelector("nav.navbar");
    const registerButton = await page.$('a[href="/register"]');
    const isRegisterButtonVisible = await registerButton.isVisible();
    expect(isRegisterButtonVisible).toBe(true);
})

// II. Tests after successful Login
// Test 3:
test('Verify "All Books" link is visible after user login', async ({page}) => {
    await page.goto(fePage);
    await page.waitForSelector("nav.navbar");
    await page.click('a[href="/login"]');
    await page.fill("#email", appUser);
    await page.fill("#password", appPassword);
    await page.click("input[type='submit']");
// Check if Logout buttons shows up - commented because shows up on second run of the test, not on the first
    // const logoutButton = await page.$('text=Login');
    // const isLogoutButtonVisible = await logoutButton.isVisible();
    // expect(isLogoutButtonVisible).toBe(true);

// Check if All Books is visible
    const allBooksLink = await page.$('a[href="/catalog"]');
    const isAllBooksLinkVisible = await allBooksLink.isVisible();
    expect(isAllBooksLinkVisible).toBe(true);
// Check if "My Books" is visible
    const myBooksLink = await page.$('a[href="/profile"]');
    const isMyBooksLinkVisible = await myBooksLink.isVisible();
    expect(isMyBooksLinkVisible).toBe(true);
// Check if "Add Book" is visible
    const addBooksLink = await page.$('a[href="/create"]');
    const isAddBooksLinkVisible = await addBooksLink.isVisible();
    expect(isAddBooksLinkVisible).toBe(true);
// Check if "User's email" is visible
    const userMailLink = await page.$("#user");
    const isUserMailLinkVisible = await userMailLink.isVisible();
    expect(isUserMailLinkVisible).toBe(true);
})
// Test 4: Login with valid credentials
test('Login with valid credentials', async ({page}) => {
    await page.goto(fePage + "/login");
    await page.fill("#email", appUser);
    await page.fill("#password", appPassword);
    await page.click("input[type='submit']");
    await page.$('a[href="/catalog"]');
    expect(page.url()).toBe(fePage + '/catalog');
})
// Test 5: Login with empty credentials
test('Login with empty credentials', async ({page}) => {
    await page.goto(fePage + "/login");
    await page.click("input[type='submit']");
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.$('a[href="/login"]');
    expect(page.url()).toBe(fePage + "/login");
})
// Test 5.1: Login with empty mail but valid password
test('Login with empty mail but valid password', async ({page}) => {
    await page.goto(fePage + "/login");
    await page.fill("#password", appPassword);
    await page.click("input[type='submit']");
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.$('a[href="/login"]');
    expect(page.url()).toBe(fePage + "/login");
})
// Test 5.2: Login with valid mail but empty password
test('Login with valid mail but empty password', async ({page}) => {
    await page.goto(fePage + "/login");
    await page.fill("#email", appUser);
    await page.click("input[type='submit']");
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.$('a[href="/login"]');
    expect(page.url()).toBe(fePage + "/login");
})
// Test 5.1.0: Register with valid values (Submit the Form with Valid Values)
test('Register Submit the Form with Valid Values', async ({page}) => {
    await page.goto(fePage);
    await page.click('a[href="/register"]');
    await page.fill("#email", mailRegistration);
    await page.fill("#password", mailRegistrationPass);
    await page.fill("#repeat-pass", mailRegistrationPass);
    await page.click('input[type="submit"]');
    await page.$('a[href="/catalog"]');
    expect(page.url()).toBe(fePage + '/catalog');
})
// Test 5.1.1: Register Submit the Form with Empty Values
test('Register Submit the Form with Empty Values', async ({page}) => {
    await page.goto(fePage);
    await page.click('a[href="/register"]');
    await page.click('input[type="submit"]');
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.$('a[href="/register"]');
    expect(page.url()).toBe(fePage + '/register');
})
// Test 5.1.2: Register Submit the Form with Empty Email
test('Register Submit the Form with Empty Email', async ({page}) => {
    await page.goto(fePage);
    await page.click('a[href="/register"]');
    await page.fill("#password", mailRegistrationPass);
    await page.fill("#repeat-pass", mailRegistrationPass);
    await page.click('input[type="submit"]');
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.$('a[href="/register"]');
    expect(page.url()).toBe(fePage + '/register');
})
// Test 5.1.3: Register Submit the Form with Empty Password
test('Register Submit the Form with Empty Password', async ({page}) => {
    await page.goto(fePage);
    await page.click('a[href="/register"]');
    await page.fill("#email", mailRegistration);
    await page.click('input[type="submit"]');
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.$('a[href="/register"]');
    expect(page.url()).toBe(fePage + '/register');
})
// Test 5.1.4: Register Submit the Form with Empty Confirm Password
test('Register Submit the Form with Empty Confirm Password', async ({page}) => {
    await page.goto(fePage);
    await page.click('a[href="/register"]');
    await page.fill("#email", mailRegistration);
    await page.fill("#password", mailRegistrationPass);
    await page.click('input[type="submit"]');
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.$('a[href="/register"]');
    expect(page.url()).toBe(fePage + '/register');
})
// Test 5.1.5: Register Submit the Form with Different Passwords
test('Register Submit the Form with Different Passwords', async ({page}) => {
    await page.goto(fePage);
    await page.click('a[href="/register"]');
    await page.fill("#email", mailRegistration);
    await page.fill("#password", mailRegistrationPass);
    await page.fill("#repeat-pass", "1234")
    await page.click('input[type="submit"]');
    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });
    await page.$('a[href="/register"]');
    expect(page.url()).toBe(fePage + '/register');
})
// Test 6: Add book with correct data
test('Add book with correct data', async ({page}) => {
    await page.goto(fePage + "/login");
    await page.fill("#email", appUser);
    await page.fill("#password", appPassword);
    await Promise.all([
        page.click("input[type='submit']"),
        page.waitForURL(fePage + "/catalog")
    ]);

    await Promise.all([
        page.click('a[href="/create"]'),
        page.waitForSelector("#create-form")
    ]);
    // #id in the page
    await page.fill("#title", bookTitleTest);
    await page.fill("#description", bookDescriptionTest);
    await page.fill("#image", bookImageTest);
    await page.selectOption("#type", bookTypeTest);
    await page.click('#create-form input[type="submit"]');
    await page.waitForURL(fePage + "/catalog");
    expect(page.url()).toBe(fePage + "/catalog");
})
// Test 7.1: Add book with empty title field
test('Add book with empty title field', async ({page}) => {
    await page.goto(fePage + "/login");
    await page.fill("#email", appUser);
    await page.fill("#password", appPassword);
    await Promise.all([
        page.click("input[type='submit']"),
        page.waitForURL(fePage + "/catalog")
    ]);

    await Promise.all([
        page.click('a[href="/create"]'),
        page.waitForSelector("#create-form")
    ]);
    await page.fill("#description", bookDescriptionTest);
    await page.fill("#image", bookImageTest);
    await page.selectOption("#type", bookTypeTest);
    await page.click('#create-form input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$('a[href="/create"]');
    expect(page.url()).toBe(fePage + "/create");
})
// Test 7.2: Add book with empty description field
test('Add book with empty description field', async ({page}) => {
    await page.goto(fePage + "/login");
    await page.fill("#email", appUser);
    await page.fill("#password", appPassword);
    await Promise.all([
        page.click("input[type='submit']"),
        page.waitForURL(fePage + "/catalog")
    ]);

    await Promise.all([
        page.click('a[href="/create"]'),
        page.waitForSelector("#create-form")
    ]);
    await page.fill("#title", bookTitleTest);
    await page.fill("#image", bookImageTest);
    await page.selectOption("#type", bookTypeTest);
    await page.click('#create-form input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$('a[href="/create"]');
    expect(page.url()).toBe(fePage + "/create");
})
// Test 7.3: Add book with empty image URL field
test('Add book with empty image URL field', async ({page}) => {
    await page.goto(fePage + "/login");
    await page.fill("#email", appUser);
    await page.fill("#password", appPassword);
    await Promise.all([
        page.click("input[type='submit']"),
        page.waitForURL(fePage + "/catalog")
    ]);

    await Promise.all([
        page.click('a[href="/create"]'),
        page.waitForSelector("#create-form")
    ]);
    await page.fill("#title", bookTitleTest);
    await page.fill("#description", bookDescriptionTest);
    await page.selectOption("#type", bookTypeTest);
    await page.click('#create-form input[type="submit"]');

    page.on('dialog', async dialog => {
        expect(dialog.type()).toContain('alert');
        expect(dialog.message()).toContain('All fields are required!');
        await dialog.accept();
    });

    await page.$('a[href="/create"]');
    expect(page.url()).toBe(fePage + "/create");
})
// Test 8: Login and verify all books are displayed or DB is Empty
test('Login and verify all books are displayed', async ({page}) => {
    await page.goto(fePage + "/login");
    await page.fill("#email", appUser);
    await page.fill("#password", appPassword);
    await Promise.all([
        page.click("input[type='submit']"),
        page.waitForURL(fePage + "/catalog")
    ]);
    await page.waitForSelector(".dashboard");
    const bookElements = await page.$$('.other-books-list li');
    expect(bookElements.length).toBeGreaterThan(0); 
    // No books test
    // const noBooksMessage = await page.textContent('.no-books');
    // expect(noBooksMessage).toBe("No books in database!");
})
// Test 9: Login and navigate to Details page
test('Login and navigate to Details page', async ({page}) => {
    await page.goto(fePage + "/login");
    await page.fill("#email", appUser);
    await page.fill("#password", appPassword);
    await Promise.all([
        page.click("input[type='submit']"),
        page.waitForURL(fePage + "/catalog")
    ]);
    await page.click('a[href="/catalog"]');
    await page.waitForSelector('.otherBooks');
    // Click on Outlander details button
    await page.click('a[href="/details/2949b54d-b163-4a00-b65c-41fb8b641561"]');
    await page.waitForSelector('.book-information');
    // Verifify Book Title
    const detailsPageTitle = await page.textContent('.book-information h3');
    expect(detailsPageTitle).toBe('Outlander');
})
// Test 9.1: Login and Verify - "Edit" and "Delete" are possible as a creator
test('Login and Verify - "Edit" and "Delete" are visible as a creator', async ({page}) => {
    await page.goto(fePage + "/login");
    await page.fill("#email", appUser);
    await page.fill("#password", appPassword);
    await Promise.all([
        page.click("input[type='submit']"),
        page.waitForURL(fePage + "/catalog")
    ]);
    await page.click('a[href="/catalog"]');
    await page.waitForSelector('.otherBooks');
    // Click on Outlander details button
    await page.click('a[href="/details/2949b54d-b163-4a00-b65c-41fb8b641561"]');
    await page.waitForSelector('.book-information');

    const editButton = await page.$('a[href="/edit/2949b54d-b163-4a00-b65c-41fb8b641561"]');
    const isEditButtonVisible = await editButton.isVisible();
    expect(isEditButtonVisible).toBe(true);

    const deleteButton = await page.$('a[href="javascript:void(0)"]');
    const isDeleteButtonVisible = await deleteButton.isVisible();
    expect(isDeleteButtonVisible).toBe(true);
})
// Test 9.2: Login and Verify non-creator sees Like button
test('Login and Verify - "Like" button is visible for non-creator', async ({page}) => {
    await page.goto(fePage + "/login");
    await page.fill("#email", appUser);
    await page.fill("#password", appPassword);
    await Promise.all([
        page.click("input[type='submit']"),
        page.waitForURL(fePage + "/catalog")
    ]);
    await page.click('a[href="/catalog"]');
    await page.waitForSelector('.otherBooks');
    await page.click('a[href="/details/f6f54fcd-0469-470b-8ffa-a33ae6c7a524"]');
    const likeButton = await page.$('a[href="javascript:void(0)"]');
    const isLikeButtonVisible = await likeButton.isVisible();
    expect(isLikeButtonVisible).toBe(true);
})
// Test 9.3: Verify That Guest User Sees Details Button and Button Works Correctly
test('Verify That Guest User Sees Details Button and Button Works Correctly', async ({page}) => {
    await page.goto(fePage);
    await page.click('a[href="/catalog"]');
    await page.waitForSelector('.otherBooks');
    // Click on Outlander details button
    await page.click('a[href="/details/2949b54d-b163-4a00-b65c-41fb8b641561"]');
    await page.waitForSelector('.book-information');
    // Verifify Book Title
    const detailsPageTitle = await page.textContent('.book-information h3');
    expect(detailsPageTitle).toBe('Outlander');
})
// Test 10: 
test('Verify visibility of "Logout" button after user login', async ({page}) => {
    await page.goto(fePage + "/login");
    await page.fill("#email", appUser);
    await page.fill("#password", appPassword);
    await page.click("input[type='submit']");
    const logoutButton = await page.$('#logoutBtn');
    const isLogoutButtonVisible = await logoutButton.isVisible();
    expect(isLogoutButtonVisible).toBe(true);
})

// Test 11: Verify redirection Logout link after user login
test('Verify That the "Logout" Button Redirects Correctly', async ({page}) => {
    await page.goto(fePage + "/login");
    
    await page.fill("#email", appUser);
    await page.fill("#password", appPassword);
    await page.click("input[type='submit']");

    const logoutLink = await page.$('a[href="javascript:void(0)"]');
    await logoutLink.click();
    await page.waitForURL(fePage + "/");
  
    const redirectedURL = page.url();
    expect(redirectedURL).toBe(fePage + "/");
})