import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Identity */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold tracking-tight text-primary">
              CyberFit Hub
            </h3>
            <p className="text-sm text-muted-foreground">
              Where digital resilience meets physical peak performance.
            </p>
          </div>

          {/* Cyber Security Lab Content */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">
              Cyber Security Lab
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-default">
                Penetration Testing Area
              </li>
              <li className="hover:text-primary transition-colors cursor-default">
                CTF & War-Room Access
              </li>
              <li className="hover:text-primary transition-colors cursor-default">
                Malware Analysis Unit
              </li>
              <li className="hover:text-primary transition-colors cursor-default">
                Network Forensics
              </li>
            </ul>
          </div>

          {/* Gymnasium Content */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">
              Power & Agility Gym
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-default">
                Strength & Conditioning
              </li>
              <li className="hover:text-primary transition-colors cursor-default">
                Cardio Endurance Zone
              </li>
              <li className="hover:text-primary transition-colors cursor-default">
                Recovery & Sauna
              </li>
              <li className="hover:text-primary transition-colors cursor-default">
                Personal Training
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">
              Facility Location
            </h4>
            <address className="not-italic text-sm text-muted-foreground space-y-2">
              <p>Jashore University of Science and Technology</p>
              <p>Jashore-7408, Bangladesh</p>
              <p className="pt-2 text-primary font-mono font-medium">
                lab@just.edu.bd
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Cyber Security Lab. All rights
            reserved. Developed by Cyber Security Lab.
          </p>
          <div className="flex gap-6">
            <span className="hover:text-foreground cursor-pointer">
              Security Protocol
            </span>
            <span className="hover:text-foreground cursor-pointer">
              Privacy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
