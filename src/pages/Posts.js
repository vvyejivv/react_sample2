import { useState, useEffect } from "react";
import Menu from '../components/Menu';
import { NavLink } from 'react-router-dom';
import './Posts.css';
function Posts() {
    const userId = sessionStorage.getItem("userId");
    const [postList, setPostList] = useState([]);
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState("");

    useEffect(() => {
        async function fetchList() {
            try {
                const response = await fetch(`http://localhost:4000/postListAll.dox`);
                const jsonData = await response.json();
                setPostList(jsonData);
                console.log(jsonData);
            } catch (error) {
                console.error("!!error!!");
            }
        }
        fetchList();
    }, []);
   const fnDelete = (postNo) => {
        async function fetchPostDelete() {
            try {
                if(window.confirm("정말 삭제하시겠습니까?")){
                    const response = await fetch(`http://localhost:4000/postingDelete.dox?userId=${userId}&postNo=${postNo}`);
                    const jsonData = await response.json();
                    console.log(jsonData.result);
                    if (jsonData.result == "success") {
                        alert(jsonData.msg);
                        window.location.href = `http://localhost:3000/Posts`;
                    } else {
                        alert("실패했습니다. 다시 시도하세요.");
                        return;
                    }
                }

            } catch (error) {
                console.error("에러!");
            }
        }
        fetchPostDelete();
    }
    const toggleComment = (postNo) => {
        setShowComment(prevState => ({
            ...prevState,
            [postNo]: !prevState[postNo]
        }));
    };
    const fnComment = (e) => {
        setComment(e.target.value);
    }

    const fnCommentSave = (postNo) => {
        async function fetchCommentSave() {
            try {
                if (comment == "") {
                    alert("댓글을 입력하세요.");
                    return;
                }
                const response = await fetch(`http://localhost:4000/commentAdd.dox?postNo=${postNo}&comment=${comment}&userId=${userId}`);
                const jsonData = await response.json();
                if (jsonData.result == "success") {
                    alert(jsonData.msg);
                    window.location.href = `http://localhost:3000/Posts`;
                } else {
                    alert("댓글 작성에 실패했습니다. 다시 시도하세요.");
                    return;
                }

            } catch (error) {
                console.error("에러!");
            }
        }
        fetchCommentSave();
    }
    return <div id="postsContainer">
        <div id="postsBox">
            <div id="postsTitleBox">
                <div id="postsTitle">Home</div>
                <div id="postsPoint"></div>
            </div>
            <div id="postsList" className="row">
                {postList.map(item => (
                    <div id="postBox" className="col-md-1" key={item.POSTNO}>

                        <div id="postSmallBox">
                            <div id="postTitleBox">
                                <div id="postUser">
                                    <div id="postUserImg"></div>
                                    <div id="postUserId"><a href="#" onClick={() => {
                                        window.location.href = `http://localhost:3000/userProfile/${item.USERID}`;
                                    }}>{item.USERID}</a></div>
                                </div>
                                <div id="postDate">{item.CDATE}</div>
                            </div>
                            <div id="postTitle">
                                <div id="postTitleTxt">{item.TITLE}</div>
                            </div>
                            <div id="postContentsBox">
                                <div id="postContents">
                                    {item.PATH == "null" || item.PATH == "" ? <div id="postPhoto"><img src=""></img></div> : ""}
                                    {item.CONTENTS}
                                </div>
                            </div>
                            <div id="postLikesCmtBox">
                                <div id="postLikesCmtSmallBox">
                                    <div id="likesBox">
                                        <div id="heartImg"></div>
                                        <div className="likesTxt">{item.LIKES}</div>
                                    </div>
                                    <div id="cmtBox">
                                        <div id="cmtImg"></div>
                                        <div className="likesTxt">0</div>
                                    </div>
                                    <div id="cmtAddBox">
                                        <div id="cmtAddTxt" onClick={() => toggleComment(item.POSTNO)}>댓글달기</div>
                                    </div>
                                </div>
                                {userId == item.USERID ? (<div id="postBtnBox">
                                    <div className="postUpdateBtn"><button onClick={()=> {
                                         window.location.href=`http://localhost:3000/postingUpdate/${item.POSTNO}`
                                    }}>수정</button></div>
                                    <div className="postDeleteBtn"><button onClick={() => fnDelete(item.POSTNO)}> 삭제</button></div>
                                </div>) : ""}

                            </div>
                        </div>
                        {/* 댓글보기 */}
                        {showComment[item.POSTNO] && (
                            <div>
                                <div id="commentContainer">
                                    <div id="commentBox">
                                        <div id="commentTitle">
                                            <div id="commentSmallBox">
                                                <div id="cmtUserBox">
                                                    <div id="cmtUserImg"></div>
                                                    <div id="cmtUserId">{item.USERID}</div>
                                                    <div id="cmtDate">{item.CDATE}</div>
                                                </div>
                                            </div>
                                            {userId == item.USERID ? (<div id="cmtBtnBox">
                                                <div className="cmtUpdateBtn"><button>수정</button></div>
                                                <div className="cmtDeleteBtn"><button>삭제</button></div>
                                            </div>) : ""}
                                        </div>
                                        <div id="commnetTxt"> 댓글테스트 </div>
                                    </div>
                                </div>
                                <div id="commentContainer">
                                    <div id="commentBox">
                                        <div id="commentSmallBox">
                                            <div id="cmtUserBox">
                                                <div id="cmtUserImg"></div>
                                                <div id="cmtUserId">{userId}</div>
                                            </div>
                                        </div>
                                        <div id="commnetAddTxt">
                                            <input type="" onChange={fnComment} />
                                            <button onClick={() => fnCommentSave(item.POSTNO)}>작성</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                ))}
            </div>

        </div>
    </div>
}
export default Posts;