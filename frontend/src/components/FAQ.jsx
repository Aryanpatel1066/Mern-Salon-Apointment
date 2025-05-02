import { useState } from "react";

const faqs = [
  {
    question: "Do I need to book an appointment in advance?",
    answer: "We recommend booking in advance to ensure your preferred time slot is available, but walk-ins are also welcome."
  },
  {
    question: "What safety and hygiene measures are in place?",
    answer: "We follow strict sanitization protocols, use disposable tools when possible, and regularly disinfect all surfaces and equipment."
  },
  {
    question: "What services do you offer for bridal packages?",
    answer: "Our bridal packages include makeup, hair styling, draping, and pre-bridal skin care treatments."
  },
  {
    question: "Do you offer home service appointments?",
    answer: "Currently, we provide in-salon services only. Home visits may be available for bridal packages on request."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept cash, UPI, debit/credit cards, and online wallets like Paytm and Google Pay."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg shadow-sm p-4 cursor-pointer transition-all"
            onClick={() => toggle(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-pink-600">{faq.question}</h3>
              <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
            </div>
            {openIndex === index && (
              <p className="text-sm text-gray-700 mt-2 transition-all">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
