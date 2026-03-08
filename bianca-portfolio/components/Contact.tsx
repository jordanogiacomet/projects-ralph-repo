"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section id="contact" className="py-24 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading - slide in from right */}
        <motion.div
          className="text-center mb-16"
          initial={prefersReducedMotion ? {} : { opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] as const }}
        >
          <p className="font-body text-sm uppercase tracking-widest text-text-secondary mb-4">
            Contato
          </p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-text-primary mb-4">
            Vamos Trabalhar Juntos
          </h2>
          <p className="font-body text-text-secondary max-w-xl mx-auto">
            Tem algum projeto em mente? Adoraria saber mais sobre isso. Envie-me uma mensagem e vamos criar algo extraordinário.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Form */}
          <motion.div
            className="md:col-span-2"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1.0] as const }}
          >
            {submitted ? (
              <div className="bg-bg-secondary border border-border rounded-xl p-12 text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="font-display text-2xl text-text-primary mb-2">
                  Mensagem Enviada!
                </h3>
                <p className="font-body text-text-secondary">
                  Obrigado por entrar em contato. Entrarei em contato com você assim que possível.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-body text-sm font-medium text-text-primary mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-bg-secondary border font-body text-text-primary placeholder:text-text-secondary/50 outline-none transition-colors duration-200 ${
                      errors.name ? "border-red-400" : "border-border focus:border-accent"
                    }`}
                    placeholder="Seu nome"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 font-body">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block font-body text-sm font-medium text-text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-bg-secondary border font-body text-text-primary placeholder:text-text-secondary/50 outline-none transition-colors duration-200 ${
                      errors.email ? "border-red-400" : "border-border focus:border-accent"
                    }`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 font-body">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block font-body text-sm font-medium text-text-primary mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg bg-bg-secondary border font-body text-text-primary placeholder:text-text-secondary/50 outline-none transition-colors duration-200 resize-none ${
                      errors.message ? "border-red-400" : "border-border focus:border-accent"
                    }`}
                    placeholder="Me fale sobre seu projeto..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500 font-body">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 bg-accent text-text-on-dark font-body font-medium rounded-full hover:bg-accent-hover transition-colors duration-200"
                >
                  Envie uma mensagem
                </button>
              </form>
            )}
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] as const }}
          >
            <h3 className="font-display text-xl text-text-primary mb-6">
              Entre em Contato
            </h3>
            <div className="space-y-5">
              <a
                href="mailto:bianca.sato@icloud.com"
                className="flex items-center gap-3 font-body text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                bianca.sato@icloud.com
              </a>
              <a
                href="#"
                className="flex items-center gap-3 font-body text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 7h-7V2H9v5H2l10 10 10-10zM2 19v2h20v-2H2z" />
                </svg>
                Behance
              </a>
              <a
                href="#"
                className="flex items-center gap-3 font-body text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
