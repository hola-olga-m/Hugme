import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { HugContext } from '../../contexts/HugContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { playHapticFeedback } from '../../utils/haptics';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  
  const { user } = useContext(UserContext);
  const { getContacts, addContact } = useContext(HugContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadContacts = async () => {
      setIsLoading(true);
      try {
        const userContacts = await getContacts(user.id);
        setContacts(userContacts);
        setFilteredContacts(userContacts);
      } catch (error) {
        console.error('Error loading contacts:', error);
        setError('Failed to load contacts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContacts();
  }, [user.id, getContacts]);
  
  // Filter contacts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredContacts(contacts);
      return;
    }
    
    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = contacts.filter(
      contact => 
        contact.name.toLowerCase().includes(lowercaseQuery) || 
        (contact.email && contact.email.toLowerCase().includes(lowercaseQuery))
    );
    
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleNewContactChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddContact = async (e) => {
    e.preventDefault();
    
    if (!newContact.name.trim()) {
      setError('Contact name is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const contactData = {
        contactId: `contact_${Date.now()}`,
        ...newContact
      };
      
      await addContact(user.id, contactData);
      
      // Refresh contact list
      const updatedContacts = await getContacts(user.id);
      setContacts(updatedContacts);
      setFilteredContacts(updatedContacts);
      
      // Reset form
      setNewContact({
        name: '',
        email: '',
        phone: ''
      });
      
      setShowAddContact(false);
      playHapticFeedback('success');
    } catch (error) {
      console.error('Error adding contact:', error);
      setError('Failed to add contact. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendHug = (contact) => {
    navigate('/hugs/send', { 
      state: { 
        preSelectedContact: contact 
      } 
    });
  };
  
  const toggleAddContact = () => {
    setShowAddContact(!showAddContact);
    setError('');
    playHapticFeedback('selection');
  };
  
  return (
    <div className={`contacts-container theme-${theme}`}>
      <header className="page-header">
        <h1>Contacts</h1>
        <button 
          className="add-contact-button"
          onClick={toggleAddContact}
        >
          <i className={`fas ${showAddContact ? 'fa-times' : 'fa-plus'}`}></i>
        </button>
      </header>
      
      {showAddContact ? (
        <div className="add-contact-form">
          <h2>Add New Contact</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleAddContact}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <div className="input-with-icon">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newContact.name}
                  onChange={handleNewContactChange}
                  placeholder="Contact name"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newContact.email}
                  onChange={handleNewContactChange}
                  placeholder="Contact email"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <div className="input-with-icon">
                <i className="fas fa-phone"></i>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newContact.phone}
                  onChange={handleNewContactChange}
                  placeholder="Contact phone"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span><i className="fas fa-spinner fa-spin"></i> Adding...</span>
              ) : (
                <span>Add Contact</span>
              )}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="contacts-list">
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : filteredContacts.length === 0 ? (
              <div className="no-contacts-message">
                {contacts.length === 0 ? (
                  <>
                    <i className="fas fa-user-friends"></i>
                    <p>You don't have any contacts yet</p>
                    <button 
                      className="add-first-contact-button"
                      onClick={toggleAddContact}
                    >
                      Add Your First Contact
                    </button>
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i>
                    <p>No contacts match your search</p>
                  </>
                )}
              </div>
            ) : (
              filteredContacts.map(contact => (
                <div key={contact.contactId} className="contact-card">
                  <div className="contact-avatar">
                    {contact.avatar ? (
                      <img src={contact.avatar} alt={contact.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="contact-info">
                    <h3>{contact.name}</h3>
                    {contact.email && <p>{contact.email}</p>}
                  </div>
                  
                  <div className="contact-actions">
                    <button 
                      className="send-hug-button"
                      onClick={() => handleSendHug(contact)}
                    >
                      <i className="fas fa-heart"></i>
                      <span>Send Hug</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
      
      {error && !showAddContact && (
        <div className="error-toast">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ContactList;
