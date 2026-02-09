import { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import "./BoardDetail.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export default function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const listNumber = state?.listNumber;
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/boards/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("게시글을 불러오지 못했습니다.");
        return res.json();
      })
      .then((json) => {
        setBoard(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="board-detail board-detail--loading">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="board-detail board-detail--error">
        <p>{error}</p>
        <Link to="/boards" className="board-detail__back">목록으로</Link>
      </div>
    );
  }

  const openDeleteConfirm = () => {
    setDeleteError(null);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    if (!deleting) setShowDeleteConfirm(false);
  };

  const handleDeleteConfirm = () => {
    setDeleteError(null);
    setDeleting(true);
    setShowDeleteConfirm(false);
    fetch(`${API_BASE}/boards/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("삭제에 실패했습니다.");
        navigate("/boards");
      })
      .catch((err) => {
        setDeleteError(err.message);
        setDeleting(false);
      });
  };

  if (!board) {
    return null;
  }

  return (
    <div className="board-detail">
      <div className="board-detail__top">
        <Link to="/boards" className="board-detail__back">
          ← 목록으로
        </Link>
        <div className="board-detail__actions">
          <Link to={`/boards/${id}/edit`} className="board-detail__edit">
            수정
          </Link>
          <button
            type="button"
            className="board-detail__delete"
            onClick={openDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>
      {deleteError && <p className="board-detail__delete-error">{deleteError}</p>}

      {showDeleteConfirm && (
        <div
          className="board-detail__confirm-overlay"
          onClick={closeDeleteConfirm}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
        >
          <div
            className="board-detail__confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="board-detail__confirm-icon" aria-hidden="true">
              🗑
            </div>
            <h2 id="delete-confirm-title" className="board-detail__confirm-title">
              글 삭제
            </h2>
            <p className="board-detail__confirm-message">
              이 글을 삭제하시겠습니까?<br />
              <span className="board-detail__confirm-hint">삭제된 글은 복구할 수 없습니다.</span>
            </p>
            <div className="board-detail__confirm-actions">
              <button
                type="button"
                className="board-detail__confirm-cancel"
                onClick={closeDeleteConfirm}
                disabled={deleting}
              >
                취소
              </button>
              <button
                type="button"
                className="board-detail__confirm-delete"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}

      <article className="board-detail__article">
        <header className="board-detail__header">
          <span className="board-detail__id">#{listNumber ?? board.id}</span>
          <h1 className="board-detail__title">{board.title}</h1>
          <p className="board-detail__writer">작성자: {board.writer}</p>
        </header>
        <div className="board-detail__content">
          {board.content}
        </div>
      </article>
    </div>
  );
}
