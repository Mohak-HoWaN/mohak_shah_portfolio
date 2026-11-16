import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contact } from "@/lib/role";

const details = [
  { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  { label: "Phone", value: "+91 88491 31175", href: "tel:+918849131175" },
  { label: "Location", value: "Mehsana, Gujarat, India" },
];

const socialLinks = [
  { label: "GitHub", href: contact.github },
  { label: "LinkedIn", href: contact.linkedin },
  { label: "X", href: contact.x },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Handled by worker/index.ts on the Cloudflare deploy
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `Subject: ${formData.subject}\n\n${formData.message}`,
        }),
      });
      const data = await response.json().catch(() => null);

      if (data?.success) {
        toast({
          title: "Message sent",
          description: "Thanks for writing. I'll reply by email.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data?.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message not sent",
        description: (error instanceof Error && error.message) || `Please email ${contact.email} instead.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="border-t py-20 md:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 className="font-display text-4xl tracking-tight md:text-6xl">Contact</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Have a vision problem, a dataset or a role in mind? Write to me and I'll reply by email.
          </p>

          <dl className="mt-10 border-t">
            {details.map((item) => (
              <div key={item.label} className="grid grid-cols-[6rem_1fr] gap-6 border-b py-4">
                <dt className="text-sm text-faint">{item.label}</dt>
                <dd>
                  {item.href ? (
                    <a href={item.href} className="link break-all">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex gap-6 text-sm">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="link">
                {social.label}
                <ArrowUpRight className="size-3.5 text-faint" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-card p-6 md:p-8 lg:col-span-7">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="h-11 bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="h-11 bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="h-11 bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={6}
              className="resize-none bg-background"
            />
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 w-full px-6 text-base sm:w-auto">
            {isSubmitting ? "Sending" : "Send message"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
