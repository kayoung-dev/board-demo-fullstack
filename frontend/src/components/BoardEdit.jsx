import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./BoardWrite.css";

const API_BASE = "/api";

export default function BoardEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/boards/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("게시글을 불러오지 못했습니다.");
        return res.json();
      })
      .then((data) => {
        setTitle(data.title ?? "");
        setContent(data.content ?? "");
        setWriter(data.writer ?? "");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    fetch(`${API_BASE}/boards/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, writer }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("수정에 실패했습니다.");
        return res.json();
      })
      .then(() => {
        navigate(`/boards/${id}`);
      })
      .catch((err) => {
        setError(err.message);
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="board-write board-write--loading">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error && !title && !content && !writer) {
    return (
      <div className="board-write board-write--error">
        <p>{error}</p>
        <Link to="/boards" className="board-write__back">목록으로</Link>
      </div>
    );
  }

  return (
    <div className="board-write">
      <Link to={`/boards/${id}`} className="board-write__back">
        ← 글 보기
      </Link>

      <h1 className="board-write__title">글 수정</h1>

      <form onSubmit={handleSubmit} className="board-write__form">
        {error && <p className="board-write__error">{error}</p>}
        <div className="board-write__field">
          <label htmlFor="edit-writer">작성자</label>
          <input
            id="edit-writer"
            type="text"
            value={writer}
            onChange={(e) => setWriter(e.target.value)}
            placeholder="작성자"
            required
          />
        </div>
        <div className="board-write__field">
          <label htmlFor="edit-title">제목</label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            required
          />
        </div>
        <div className="board-write__field">
          <label htmlFor="edit-content">내용</label>
          <textarea
            id="edit-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용"
            rows={10}
            required
          />
        </div>
        <div className="board-write__actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "수정 중..." : "완료"}
          </button>
          <Link to={`/boards/${id}`} className="board-write__cancel">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
