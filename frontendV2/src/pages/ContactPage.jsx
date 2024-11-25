import React from 'react';
import NavbarComponent from '../components/NavbarComponent'; // Adjust the path as necessary
import ContactForm from '../components/ContactForm'; // Adjust the path as necessary

const ContactPage = () => {
  return (
    <div className='bg-black'>
      <NavbarComponent />
      <ContactForm />
    </div>
  );
};

export default ContactPage;