import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BoardWrite.css";

const API_BASE = "/api";

export default function BoardWrite() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    fetch(`${API_BASE}/boards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, writer }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("등록에 실패했습니다.");
        return res.json();
      })
      .then((data) => {
        navigate(`/boards/${data.id}`);
      })
      .catch((err) => {
        setError(err.message);
        setSubmitting(false);
      });
  };

  return (
    <div className="board-write">
      <Link to="/boards" className="board-write__back">
        ← 목록으로
      </Link>

      <h1 className="board-write__title">글쓰기</h1>

      <form onSubmit={handleSubmit} className="board-write__form">
        {error && <p className="board-write__error">{error}</p>}
        <div className="board-write__field">
          <label htmlFor="writer">작성자</label>
          <input
            id="writer"
            type="text"
            value={writer}
            onChange={(e) => setWriter(e.target.value)}
            placeholder="작성자"
            required
          />
        </div>
        <div className="board-write__field">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            required
          />
        </div>
        <div className="board-write__field">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용"
            rows={10}
            required
          />
        </div>
        <div className="board-write__actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "등록 중..." : "등록"}
          </button>
          <Link to="/boards" className="board-write__cancel">
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
