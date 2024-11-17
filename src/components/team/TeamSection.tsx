import { employees } from '@/data/employees';
import { EmployeeCard } from './EmployeeCard';
import { Users } from 'lucide-react';

export function TeamSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
            Ekibimizle Tanışın
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Finansal teknoloji alanında uzman ekibimiz, sizlere en iyi hizmeti sunmak için çalışıyor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {employees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      </div>
    </section>
  );
}