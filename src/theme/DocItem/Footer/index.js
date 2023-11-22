import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import Footer from '@theme-original/DocItem/Footer';
import { useDoc } from '@docusaurus/theme-common/internal';
import styles from './styles.module.css';
import { trackStructEvent } from '@snowplow/browser-tracker';

function CommentBox({ handleSubmit, feedbackTextRef }) {
  const placeholder = 'How can we improve it?';

  return (
    <form className={styles.feedbackComment} onSubmit={handleSubmit}>
      <textarea
        ref={feedbackTextRef}
        placeholder={placeholder}
        rows={3}
        cols={34}
        maxLength="999"
        required 
      />
      <button className="snowplow-button" type="submit">
        Send feedback
      </button>
    </form>
  );
}

function Feedback() {
  const { permalink } = useDoc().metadata;
  const feedbackTextRef = useRef();
  const buttonLikeRef = useRef();
  const buttonDislikeRef = useRef();

  const [isTextboxVisible, setIsTextboxVisible] = useState(false);
  const [isThanksVisible, setIsThanksVisible] = useState(false);

  const handleLike = () => {
    buttonLikeRef.current.blur();
    setIsTextboxVisible(false);

    setIsThanksVisible(true);
    setTimeout(() => {
      setIsThanksVisible(false);
    }, 1000);

    trackStructEvent({
      category: 'feedback',
      action: 'like',
      label: permalink,
    });
  };

  const handleDislike = () => {
    buttonDislikeRef.current.blur();
    setIsTextboxVisible((current) => !current);
    setIsThanksVisible(false);

    trackStructEvent({
      category: 'feedback',
      action: 'dislike',
      label: permalink,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = feedbackTextRef.current.value;

    if (text.trim() === '') {      
      alert('Please enter feedback before submitting.');
      return;
    }

    trackStructEvent({
      category: 'feedback',
      action: 'comment',
      label: permalink,
      property: text,
    });

    setIsTextboxVisible((current) => !current);
    setIsThanksVisible(true);
    setTimeout(() => {
      setIsThanksVisible(false);
    }, 1000);
  };

  return (
    <footer>
      <div className={styles.feedbackPrompt}>
        
      </div>
      {isTextboxVisible && (
        <CommentBox
          handleSubmit={handleSubmit}
          feedbackTextRef={feedbackTextRef}
        />
      )}
      {isThanksVisible && (
        <div className={styles.feedbackThanksMessage}>
          Thanks for your feedback!
        </div>
      )}
    </footer>
  );
}

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <Feedback />
    </>
  );
}
