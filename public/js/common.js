//share code that each pages can reuse (this file uses jquery)
$("#postTextarea, #replyTextarea").keyup((event) => {
    const textbox = $(event.target);
    const value = textbox.val().trim()
    const isModal = textbox.parents(".modal").length == 1; 

    const submitButton = isModal ? $("#submitReplyButton") : $("#submitPostButton")
    
    if (submitButton.length == 0) return alert("no submit button found")

    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }
    submitButton.prop("disabled", false)
})


$("#submitPostButton, #submitReplyButton").click((event) => {
    const button = $(event.target);
    const isModal = button.parents(".modal").length == 1
    const textbox = isModal ? $("#replyTextarea") : $("#postTextarea")
    const data = {
        content: textbox.val()
    }

    if (isModal) {
        const id = button.data().data;
        if (id == null) return alert("Button id is null");
        data.replyTo = id;
    }

    $.post("/api/posts", data, (postData, status, xhr) => {
        // console.log( postData)

        if (postData.replyTo) {
            location.reload();
        } else {
            const html = createPostHtml(postData);
            $(".postsContainer").prepend(html);
            textbox.val("");
            button.prop("disabled", true);
        }
    })
})

$("#replyModal").on("show.bs.modal", (event) => {
    const button = $(event.relatedTarget);
    const postId = getPostIdFromElement(button);
    $("#submitReplyButton").data("data", postId);

    $.get(`/api/posts/${postId}`, results => {
        outputPosts(results, $("#originalPostContainer"))
    })
})
$("#replyModal").on("hidden.bs.modal", () => $("#originalPostContainer").html(""))

$(document).on("click", ".likeButton", (event) => {
    const button = $(event.target);
    const postId = getPostIdFromElement(button);
    
    if (postId === undefined) return; 

    $.ajax({
        url: `api/posts/${postId}/like`,
        type: "PUT", 
        success: (postData) => {
            button.find("span").text(postData.likes.length || ""); 

            if (postData.likes.includes(userLoggedIn._id)) {
                button.addClass("active")
            } else {
                button.removeClass("active")
            }
        }
    })
})

$(document).on("click", ".post", (event) => {
    const element = $(event.target);
    const postId = getPostIdFromElement(element);

    if (postId !== undefined && !element.is("button")) {
        window.location.href = '/posts/' + postId
    }
})


function getPostIdFromElement (element) {
    const isRootElement = element.hasClass("post"); 
    const rootElement = isRootElement === true ? element : element.closest(".post");
    const postId = rootElement.data().id; 

    if (postId === undefined) return alert("Post Id is not defiend");
    return postId;  
}

function createPostHtml(postData){
    const postedBy = postData.postedBy;
    if (postedBy._id === undefined){
        return console.log('user obj not poulated')
    }
    const fullName = postedBy.firstName + " " + postedBy.lastName;
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";

    let replyFlag = ""; 

    if (postData.replyTo) {
        if (!postData.replyTo._id) {
            return alert("Reply to is not populated")
        } else if (!postData.replyTo.postedBy._id) {
            return alert("Posted by is not populated")
        }
        const replyToUsername = postData.replyTo.postedBy.username; 
        replyFlag = `<div class='replyFlag'>
                        Replying to <a href='/profile/${replyToUsername}' >@${replyToUsername}</a>
                    </div>`
    }
    return `<div class='post' data-id='${postData._id}'>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePicture}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}' class='fullName'>${fullName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'> ${timestamp} </span>
                        </div>
                        ${replyFlag}
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button data-bs-toggle='modal' data-bs-target='#replyModal'>
                                    <i class="fa-regular fa-comment"></i>
                                </button>
                            </div>
                            <div class='postButtonContainer blue'>
                                <button class='likeButton ${likeButtonActiveClass}'>
                                    <i class="fa-regular fa-heart"></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                        `;
}

// source: https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time
function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (elapsed / 1000 < 30) return "just now";
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

function outputPosts(results, container) {
    container.html("");

    if (!Array.isArray(results)) results = [results]; 

    results.forEach(result => {
        const html = createPostHtml(result);
        container.append(html)
    });
    if (results.length == 0) {
        container.append("<span>No Discussions Yet</span>")
    }
}