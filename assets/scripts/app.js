const listElement = document.querySelector('.posts');
const postTemplate = document.querySelector('#single-post');
const form = document.querySelector('#new-post form');
const fetchBtn = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');

const sendHttpRequest = (method, url, data) => {
  // const promise = new Promise((resolve, reject) => {
  //   const xhr = new XMLHttpRequest();

  //   xhr.open(method, url);

  //   xhr.onload = () => {
  //     if (xhr.status >= 200 && xhr.status < 300) {
  //       resolve(xhr.response);
  //     } else {
  //       reject(new Error('Something went wrong...'));
  //     }
  //     // const posts = JSON.parse(xhr.response);
  //     // resolve(posts);
  //   };

  //   xhr.onerror = () => {
  //     reject(new Error('Failed to send request!'));
  //   };

  //   xhr.send(JSON.stringify(data));
  // });
  // return promise;

  const responseJson = fetch(url, {
    method: method,
    body: data,
    // body: JSON.stringify(data),
    // headers: {
    //   'Content-type': 'application/json',
    // },
  }).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      return response.json().then((errorData) => {
        console.log(errorData);
        throw new Error('Something went wrong - server side!');
      });
    }
  });

  return responseJson;
};

const fetchPosts = () => {
  sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts')
    .then((responseData) => {
      // Clear the list
      listElement.innerHTML = '';

      const posts = responseData;
      for (const post of posts) {
        const postElement = document.importNode(postTemplate.content, true);
        postElement.querySelector('h2').textContent = post.title.toUpperCase();
        postElement.querySelector('p').textContent = post.body;

        postElement.querySelector('li').id = post.id;

        listElement.append(postElement);
      }
    })
    .catch((error) => {
      alert(error.message);
    });
};

const createPost = (title, content) => {
  const userId = Math.random();
  const post = {
    title: title,
    body: content,
    userId: userId,
  };

  const fd = new FormData(form);

  // fd.append('title', title);
  // fd.append('body', content);
  fd.append('userId', userId);

  sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', fd);
};

fetchBtn.addEventListener('click', () => {
  fetchPosts();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const enteredTitle = event.currentTarget.querySelector('#title').value;
  const enteredContent = event.currentTarget.querySelector('#content').value;

  createPost(enteredTitle, enteredContent);
});

postList.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    const postId = event.target.closest('li').id;
    console.log(postId);
    sendHttpRequest(
      'DELETE',
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
  }
});
