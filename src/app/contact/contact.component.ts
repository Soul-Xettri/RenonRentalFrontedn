import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    message: '',
  };

  successMessage = '';
  errorMessage = '';
  isSubmitting = false;



    // Replace with your actual EmailJS service ID, template ID, and user ID
    sendEmail() {
      this.isSubmitting = true;
    
      // Replace with your EmailJS service ID, template ID, and public API key
      const serviceID = 'service_isc9h4p';
      const templateID = 'template_704ngsg';
      const publicKey = 'gQhsRBWQt3f97HeSe'; // Replace with your actual public API key
    
      emailjs
        .send(serviceID, templateID, this.formData, publicKey)
        .then(
          (result: EmailJSResponseStatus) => {
            this.successMessage = 'Message sent successfully!';
            this.errorMessage = '';
            this.isSubmitting = false;
            this.formData = { name: '', email: '', message: '' };
          },
          (error) => {
            this.errorMessage = 'Failed to send the message. Please try again.';
            this.successMessage = '';
            this.isSubmitting = false;
          }
        );
    }
    

}
