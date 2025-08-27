import React from 'react';
import './App.css';
import { useEffect, useState} from 'react';
import ScrollToTopButton from './components/ScrollToTopButton';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // use state
  const [totalPage, setTotalPage] = useState(1);
  const [searchContent, setSearchContent] = useState();

  const handleSuggestedClick = (event) => {
    const td = event.target.closest("td"); // get closest <td>
    const answerDiv = td.querySelector(".answer");
    if (answerDiv) {
      answerDiv.style.display = answerDiv.style.display === "none" ? "block" : "none";
    }
    event.target.value = answerDiv.style.display === "block" ? "Hide Suggested Answer" : "Show Suggested Answer";
  };

  const handleVotingClick = (event) => {
    const td = event.target.closest("td"); // get closest <td>
    const votingDiv = td.querySelector(".voting-answer");
    if (votingDiv) {
      votingDiv.style.display = votingDiv.style.display === "none" ? "block" : "none";
    }
    event.target.value = votingDiv.style.display === "block" ? "Hide Voting Answer" : "Show Voting Answer";
  };

  const handlePreviousPageClick = () => {
    const newPage = currentPage - 1;
    pageSelelect(searchContent, newPage);
  };

  const handleNextPageClick = () => {
    const newPage = currentPage + 1;
    pageSelelect(searchContent, newPage);
  };

  const handlePageSelect = (event) => {
    const selectedPage = Number(event.target.value);
    pageSelelect(searchContent, selectedPage);
  };

  const pageSelelect = (searchStr, selectedPage) => {
    setSearchContent(searchStr);
    setCurrentPage(selectedPage);
    if(searchStr == null || searchStr === ''){
      fetch(`/api/questions?page=${selectedPage}`)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.data);
        setTotalPage(data.totalPage);
      })
      .catch((error) => console.error('Error fetching questions:', error));
    }
    else{
      fetch(`/api/questions?page=${selectedPage}&searchParam=${encodeURIComponent(searchStr)}`)
        .then((response) => response.json())
        .then((data) => {
          setQuestions(data.data);
          setTotalPage(data.totalPage);
        })
        .catch((error) => console.error('Error fetching questions:', error));
    }
  }

  const handleSearchButton = (event) => {
    const searchStr = event.target.previousSibling.value;
    pageSelelect(searchStr, 1);
  }

  useEffect(() => {
    fetch(`/api/questions?page=1`)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.data);
        setTotalPage(data.totalPage);
      })
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  return (
    <div className="App">
      <div>
        <ScrollToTopButton />
        <div style={{ position: 'sticky' , top: '0px', backgroundColor: '#95acc2ff', padding: '10px', zIndex: '1' }}>
          <h1 style={{ marginTop: '0px', marginBottom: '10px', color: 'white'}}>Welcome to Exam question</h1>
          <input type='text' name="search-text" style={{ float: 'left'}} />
          <input type='button' value="search" className='search' onClick={handleSearchButton} style={{ float: 'left'}}/>
          <input type='button' value='previous page' disabled={currentPage === 1} onClick={handlePreviousPageClick} style={{ marginRight: '10px' }}/>
          <input type='button' value='next page' disabled={questions.length < 20} onClick={handleNextPageClick} style={{ marginRight: '10px' }}/>
          <select onChange={handlePageSelect}>
            {Array.from({ length: totalPage }, (_, i) => i + 1).map(pageNum => (
              <option key={pageNum} value={pageNum} selected={pageNum === currentPage}>{pageNum}</option>
            ))}
          </select>
        </div>
        <table style={{ textAlign: 'left' , marginLeft: '20px'}}>
          <tbody>
            {questions.map(q => (
              <tr key={q.id}>
                <td>
                  <p style={{ margin: '0px'}}>
                    <strong>{q.questionNo}. {" "}</strong>
                    {q.content.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                  <br/>
                  <div>
                    {q.questionImages != null && q.questionImages.map(img => (
                      // <img key={img.id} src={`data:image/png;base64,${img.imageBase64}`} alt={`Image ${img.id}`} style={{ width: "50%", maxWidth: "900px", margin: "5px" }}/>
                      <img key={img.id} src={img.imageUrl} alt={`Image ${img.id}`} style={{ width: "50%", maxWidth: "900px", margin: "5px" }}/>
                    ))}
                  </div>
                  {q.questionChoices.map( c => (
                    <div key={c.id}>
                      <label>{c.content}</label>
                    </div>
                  ))}
                  <input type='button' className='show-answer' value='Show Suggested Answer' style={{ marginTop: '10px', marginRight: '10px' }} onClick={handleSuggestedClick}/>
                  <input type='button' className='show-voting' value='Show Voting Answer' style={{ marginTop: '10px' }} onClick={handleVotingClick}/>
                  <div className='answer' style={{ display: 'none' }}>
                    <strong>Suggested answer: </strong>{q.answer.content}
                  </div>
                  <div className='voting-answer' style={{ display: 'none' }}>
                    <strong>Voting answer:</strong>
                    {q.votingAnswers.map( v => (
                      <div key={v.id}>
                        <label>{v.content}: {v.rating}%</label>
                      </div>
                    ))}
                  </div>
                  <br />
                  <a href={q.sourceUrl} target="_blank" rel="noopener noreferrer">{q.sourceUrl}</a>
                  <hr />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <input type='button' value='previous page' disabled={currentPage === 1} onClick={handlePreviousPageClick} style={{ marginRight: '10px' }}/>
        <input type='button' value='next page' disabled={questions.length < 20} onClick={handleNextPageClick} style={{ marginRight: '10px' }}/>
        <select onChange={handlePageSelect}>
          {Array.from({ length: totalPage }, (_, i) => i + 1).map(pageNum => (
            <option key={pageNum} value={pageNum} selected={pageNum === currentPage}>{pageNum}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default App;
