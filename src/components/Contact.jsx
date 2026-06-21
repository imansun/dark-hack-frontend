import { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      if (res.ok) {
        setStatus('success');
        setName('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section container">
      <h2 className="section__title">Let's Connect!</h2>
      <div className="contact">
        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__field-wrapper">
            <label htmlFor="contactNameTxt">Name:</label>
            <input
              id="contactNameTxt"
              type="text"
              placeholder="What's your name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="contact__field-wrapper">
            <label htmlFor="contactDescriptionTxt">Message:</label>
            <textarea
              id="contactDescriptionTxt"
              placeholder="Lets connect!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="contact__submit-btn">Submit</button>
          {status === 'sending' && <p style={{ marginTop: '1rem', textAlign: 'center', color: '#00FF94' }}>Sending...</p>}
          {status === 'success' && <p style={{ marginTop: '1rem', textAlign: 'center', color: '#00FF94' }}>Message sent successfully!</p>}
          {status === 'error' && <p style={{ marginTop: '1rem', textAlign: 'center', color: '#ff6b6b' }}>Failed to send. Try again.</p>}
        </form>
        <span className="contact__illustration">
          <img src="/assets/illustrations/connect.svg" alt="Group of people connecting with each other" />
        </span>
      </div>
    </section>
  );
}
