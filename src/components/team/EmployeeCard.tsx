import { Employee } from '@/types/employee';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmployeeCardProps {
  employee: Employee;
  className?: string;
}

export function EmployeeCard({ employee, className }: EmployeeCardProps) {
  const initials = employee.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-lg', className)}>
      <CardHeader className="relative p-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-500/5" />
        <div className="relative p-6 flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={employee.imageUrl} alt={employee.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold">{employee.name}</h3>
          <p className="text-sm text-muted-foreground">{employee.position}</p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{employee.bio}</p>
          
          <div className="flex flex-wrap gap-2">
            {employee.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-4 pt-4">
            {employee.socialLinks?.linkedin && (
              <a
                href={employee.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {employee.socialLinks?.twitter && (
              <a
                href={employee.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {employee.socialLinks?.github && (
              <a
                href={employee.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}