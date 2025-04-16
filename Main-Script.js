const users = [
    { email: "wael@maliks.com", password: "admin123", role: "admin" },
    { email: "Branches@maliks.com", password: "user123", role: "viewer" }
    ];

    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const contentSection = document.getElementById('content-section');
    const adminSection = document.getElementById('admin-section');

    let currentUser = null;

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const authenticatedUser = users.find(user => user.email === email && user.password === password);

        if (authenticatedUser) {
            currentUser = authenticatedUser;
            loginSection.style.display = 'none'; 
            contentSection.style.display = 'block'; 

            if (currentUser.role === 'admin') {
                adminSection.style.display = 'block'; 
            } else {
                adminSection.style.display = 'none'; 
            }

            loadPosts();
        } else {
            alert('Invalid email or password!');
        }
    });

    const postButton = document.getElementById('Post-button');
    const postInput = document.getElementById('post-input');
    const mediaUpload = document.getElementById('media-upload');
    const postsContainer = document.getElementById('posts-container');

    postButton.addEventListener('click', () => {
        const postText = postInput.value;
        const file = mediaUpload.files[0];

        if (postText.trim() !== "" || file) {
            const postTime = new Date().toLocaleString();
            const media = file ? URL.createObjectURL(file) : null;

            savePostToLocalStorage(postText, postTime, media, 0);
            createPostElement(postText, postTime, media, 0);

            postInput.value = "";
            mediaUpload.value = "";
        }
    });

    function savePostToLocalStorage(text, time, media, likes) {
        const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
        savedPosts.push({ text, time, media, likes });
        localStorage.setItem('posts', JSON.stringify(savedPosts));
    }

    function loadPosts() {
        const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
        postsContainer.innerHTML = '';
        savedPosts.forEach(post => {
            createPostElement(post.text, post.time, post.media, post.likes || 0);
        });
    }

    function updateLikesInLocalStorage(text, time, newLikes) {
        let savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
        savedPosts = savedPosts.map(post => {
            if (post.text === text && post.time === time) {
                return { ...post, likes: newLikes };
            }
            return post;
        });
        localStorage.setItem('posts', JSON.stringify(savedPosts));
    }

    function deletePostFromLocalStorage(text, time) {
        let savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
        savedPosts = savedPosts.filter(post => !(post.text === text && post.time === time));
        localStorage.setItem('posts', JSON.stringify(savedPosts));
    }

    function createPostElement(text, time, media = null, likes = 0) {
        const newPost = document.createElement('div');
        newPost.classList.add('post');

        let mediaContent = '';
        if (media) {
            if (media.includes('video')) {
                mediaContent = `<video controls src="${media}" width="100%"></video>`;
            } else {
                mediaContent = `<img src="${media}" alt="Media" width="100%" />`;
            }
        }

        newPost.innerHTML = `
            <div class="post-top">
                <div class="post-info">
                    <p class="name">Stationery Department</p>
                    <span class="time">${time}</span>
                </div>
                <i class="fas fa-ellipsis-h"></i>
            </div>
            <div class="post-content">${text}</div>
            ${mediaContent}
            <div class="post-bottom">
                <div class="action like-action">
                    <i class="far fa-thumbs-up"></i>
                    <span class="like-count">${likes} Like${likes !== 1 ? 's' : ''}</span>
                </div>
                ${currentUser.role === 'admin' ? '<button class="delete-btn">Delete</button>' : ''}
            </div>
        `;

        const likeIcon = newPost.querySelector('.fa-thumbs-up');
        const likeCount = newPost.querySelector('.like-count');
        let currentLikes = likes;

        likeIcon.addEventListener('click', function () {
            const liked = likeIcon.classList.toggle('liked');
            currentLikes = liked ? currentLikes + 1 : currentLikes - 1;
            likeIcon.style.color = liked ? 'blue' : 'black';
            likeCount.textContent = `${currentLikes} Like${currentLikes !== 1 ? 's' : ''}`;
            updateLikesInLocalStorage(text, time, currentLikes);
        });

        if (currentUser.role === 'admin') {
            newPost.querySelector('.delete-btn').addEventListener('click', function () {
                newPost.remove();
                deletePostFromLocalStorage(text, time);
            });
        }

        postsContainer.prepend(newPost);
    }

