import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./BoardList.css";

const API_BASE = "/api";

export default function BoardList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywordFromUrl = searchParams.get("keyword") ?? "";
  const pageFromUrl = Math.max(0, parseInt(searchParams.get("page") ?? "0", 10));
  const sizeFromUrl = Math.max(1, Math.min(50, parseInt(searchParams.get("size") ?? "5", 10)));

  const [searchInput, setSearchInput] = useState(keywordFromUrl);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSearchInput(keywordFromUrl);
  }, [keywordFromUrl]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      page: String(pageFromUrl),
      size: String(sizeFromUrl),
      sort: "id,desc",
    });
    if (keywordFromUrl.trim()) params.set("keyword", keywordFromUrl.trim());
    fetch(`${API_BASE}/boards?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("게시글 목록을 불러오지 못했습니다.");
        return res.json();
      })
      .then((json) => {
        setPageData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [pageFromUrl, sizeFromUrl, keywordFromUrl]);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = searchInput.trim();
    setSearchParams(value ? { keyword: value, page: "0", size: String(sizeFromUrl) } : { size: String(sizeFromUrl) });
  };

  const setPage = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(newPage));
    next.set("size", String(sizeFromUrl));
    setSearchParams(next);
  };

  if (loading) {
    return (
      <div className="board-list board-list--loading">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="board-list board-list--error">
        <p>{error}</p>
        <p className="board-list__hint">백엔드 서버(localhost:8080)가 실행 중인지 확인해 주세요.</p>
      </div>
    );
  }

  const { content = [], totalElements = 0, totalPages = 0, number: currentPage } = pageData;
  const hasContent = content.length > 0;
  const isSearching = keywordFromUrl.trim() !== "";

  return (
    <div className="board-list">
      <header className="board-list__header">
        <div className="board-list__header-left">
          <h1 className="board-list__title">게시판</h1>
          <nav className="board-list__nav">
            <span className="board-list__nav-item">메뉴1</span>
            <span className="board-list__nav-item">메뉴2</span>
            <span className="board-list__nav-item">메뉴3</span>
          </nav>
        </div>
        <form className="board-list__search" onSubmit={handleSearch}>
          <input
            type="text"
            className="board-list__search-input"
            placeholder="제목 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="검색어"
          />
          <button type="submit" className="board-list__search-btn">
            검색
          </button>
          {isSearching && (
            <button
              type="button"
              className="board-list__search-clear"
              onClick={() => {
                setSearchInput("");
                setSearchParams({});
              }}
            >
              초기화
            </button>
          )}
        </form>
      </header>

      {!hasContent ? (
        <>
          <p className="board-list__empty">등록된 게시글이 없습니다.</p>
          <p className="board-list__meta board-list__meta--bottom">
            {isSearching ? (
              <>검색 결과 {totalElements}건</>
            ) : (
              <>전체 {totalElements}건</>
            )}
            {totalPages > 0 && ` · ${currentPage + 1} / ${totalPages} 페이지`}
          </p>
          <div className="board-list__footer">
            <Link to="/boards/write" className="board-list__write-btn">
              글쓰기
            </Link>
          </div>
        </>
      ) : (
        <>
          <ul className="board-list__table-wrap">
            <li className="board-list__row board-list__row--head">
              <span className="board-list__cell board-list__cell--id">번호</span>
              <span className="board-list__cell board-list__cell--title">제목</span>
              <span className="board-list__cell board-list__cell--writer">작성자</span>
            </li>
            {content.map((board, index) => {
              const listNumber = totalElements - (currentPage * sizeFromUrl + index);
              return (
              <li key={board.id} className="board-list__row">
                <Link
                  to={`/boards/${board.id}`}
                  state={{ listNumber }}
                  className="board-list__row-link"
                >
                  <span className="board-list__cell board-list__cell--id">
                    {listNumber}
                  </span>
                  <span className="board-list__cell board-list__cell--title" title={board.title}>
                    {board.title}
                  </span>
                  <span className="board-list__cell board-list__cell--writer">{board.writer}</span>
                </Link>
              </li>
            );
            })}
          </ul>

          {totalPages > 1 && (
            <nav className="board-list__pagination">
              <button
                type="button"
                disabled={currentPage <= 0}
                onClick={() => setPage(currentPage - 1)}
                aria-label="이전 페이지"
              >
                이전
              </button>
              <span className="board-list__page-info">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setPage(currentPage + 1)}
                aria-label="다음 페이지"
              >
                다음
              </button>
            </nav>
          )}
          <p className="board-list__meta board-list__meta--bottom">
            {isSearching ? (
              <>검색 결과 {totalElements}건</>
            ) : (
              <>전체 {totalElements}건</>
            )}
            {totalPages > 0 && ` · ${currentPage + 1} / ${totalPages} 페이지`}
          </p>
          <div className="board-list__footer">
            <Link to="/boards/write" className="board-list__write-btn">
              글쓰기
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
