from django.core.management.base import BaseCommand
from django.utils import timezone
from authentication.models import User, UserRole, VerificationStatus, IdentityVerificationRequest


class Command(BaseCommand):
    help = 'Seeds initial test users, mentors, experts, and verification requests for MentorConnect'

    def handle(self, *args, **options):
        self.stdout.write("Seeding MentorConnect test accounts...")

        users_data = [
            {
                'username': 'admin',
                'email': 'admin@mentorconnect.org',
                'first_name': 'Eleanor',
                'last_name': 'Vance',
                'role': UserRole.ADMIN,
                'verification_status': VerificationStatus.VERIFIED,
                'is_staff': True,
                'is_superuser': True,
                'headline': 'Platform Lead & Academic Integrity Officer',
                'institution_or_company': 'MentorConnect HQ / Stanford University',
                'degree_or_title': 'Ph.D. Education & Technology',
                'bio': 'Overseeing cross-domain peer mentorship networks and verified credential integrity.',
                'avatar_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
                'domains': ['Computer Science', 'Career Navigation', 'Academic Research'],
                'skills': ['Leadership', 'Program Assessment', 'Ethics in AI'],
            },
            {
                'username': 'alex_student',
                'email': 'alex.chen@berkeley.edu',
                'first_name': 'Alex',
                'last_name': 'Chen',
                'role': UserRole.STUDENT,
                'verification_status': VerificationStatus.PENDING,
                'headline': 'Junior CS & Cognitive Science Undergraduate',
                'institution_or_company': 'UC Berkeley',
                'degree_or_title': 'B.S. in Computer Science (Class of 2027)',
                'bio': 'Passionate about full-stack web applications, machine learning architectures, and peer study groups.',
                'avatar_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
                'domains': ['Computer Science', 'Artificial Intelligence', 'Web Development'],
                'skills': ['Python', 'Angular', 'Algorithms', 'TypeScript', 'PostgreSQL'],
                'github_profile': 'https://github.com/alexchen-dev',
                'sessions_completed': 8,
                'students_mentored': 0,
            },
            {
                'username': 'maya_mentor',
                'email': 'maya.patel@alumni.cmu.edu',
                'first_name': 'Maya',
                'last_name': 'Patel',
                'role': UserRole.MENTOR,
                'verification_status': VerificationStatus.VERIFIED,
                'headline': 'Senior Software Engineer & Systems Mentor',
                'institution_or_company': 'Stripe (ex-CMU)',
                'degree_or_title': 'M.S. Software Engineering',
                'bio': 'Dedicated to helping students and early-career engineers ace system design, interview preparation, and distributed systems fundamentals.',
                'avatar_url': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
                'domains': ['Computer Science', 'Distributed Systems', 'Career Navigation'],
                'skills': ['System Design', 'Django', 'Go', 'Microservices', 'Mentorship Strategy'],
                'years_of_experience': 4,
                'rating': 4.95,
                'total_reviews': 38,
                'sessions_completed': 42,
                'students_mentored': 19,
                'linkedin_profile': 'https://linkedin.com/in/mayapatel-tech',
            },
            {
                'username': 'dr_marcus',
                'email': 'marcus.rossi@oxford.ac.uk',
                'first_name': 'Dr. Marcus',
                'last_name': 'Rossi',
                'role': UserRole.EXPERT,
                'verification_status': VerificationStatus.VERIFIED,
                'headline': 'Principal Research Scientist & AI Fellow',
                'institution_or_company': 'Oxford Institute of Genomics & DeepMind',
                'degree_or_title': 'Ph.D. Computational Biology & ML',
                'bio': 'Advising graduate researchers, postdoctoral scholars, and industry engineers on AI-driven drug discovery, deep learning, and publication strategies.',
                'avatar_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
                'domains': ['Artificial Intelligence', 'Bioinformatics', 'Academic Research'],
                'skills': ['Deep Learning', 'PyTorch', 'Paper Review', 'Grant Writing', 'Bioinformatics'],
                'years_of_experience': 12,
                'rating': 5.0,
                'total_reviews': 54,
                'sessions_completed': 73,
                'students_mentored': 31,
                'linkedin_profile': 'https://linkedin.com/in/marcus-rossi-phd',
            },
            {
                'username': 'sarah_design',
                'email': 'sarah.k@risd.edu',
                'first_name': 'Sarah',
                'last_name': 'Kim',
                'role': UserRole.MENTOR,
                'verification_status': VerificationStatus.VERIFIED,
                'headline': 'Lead Product Designer & Design Systems Mentor',
                'institution_or_company': 'Figma Community / RISD Alum',
                'degree_or_title': 'B.F.A. Industrial & Interaction Design',
                'bio': 'Empowering students to build world-class portfolios, understand accessibility standards, and master UI/UX component systems.',
                'avatar_url': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
                'domains': ['Product Design', 'UI/UX', 'Career Navigation'],
                'skills': ['Figma', 'User Research', 'Design Systems', 'Design Critique', 'Accessibility'],
                'years_of_experience': 5,
                'rating': 4.9,
                'total_reviews': 24,
                'sessions_completed': 31,
                'students_mentored': 14,
            },
            {
                'username': 'jordan_finance',
                'email': 'jordan.lee@wharton.upenn.edu',
                'first_name': 'Jordan',
                'last_name': 'Lee',
                'role': UserRole.EXPERT,
                'verification_status': VerificationStatus.PENDING,
                'headline': 'Fintech Analyst & Quantitative Strategy Advisor',
                'institution_or_company': 'BlackRock / Wharton Alum',
                'degree_or_title': 'M.B.A. Quantitative Finance',
                'bio': 'Mentoring students breaking into financial modeling, quant analytics, and fintech product development.',
                'avatar_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
                'domains': ['Business & Finance', 'Fintech', 'Career Navigation'],
                'skills': ['Financial Modeling', 'Risk Analysis', 'Python for Finance', 'Valuation'],
                'years_of_experience': 6,
                'rating': 4.85,
                'total_reviews': 16,
                'sessions_completed': 19,
                'students_mentored': 9,
            }
        ]

        for u_info in users_data:
            username = u_info['username']
            user, created = User.objects.get_or_create(username=username, defaults=u_info)
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Created user: {username} ({user.role})"))
            else:
                self.stdout.write(f"User {username} already exists.")

        # Seed sample verification requests for review
        admin_user = User.objects.filter(role=UserRole.ADMIN).first()
        alex_user = User.objects.filter(username='alex_student').first()
        jordan_user = User.objects.filter(username='jordan_finance').first()

        if alex_user and not IdentityVerificationRequest.objects.filter(user=alex_user).exists():
            IdentityVerificationRequest.objects.create(
                user=alex_user,
                document_type='STUDENT_ID',
                document_number_or_info='UCB-2027-891024',
                institution_name='University of California, Berkeley',
                notes='Official Spring 2026 Student Cal 1 Card with valid registration sticker.',
                document_file_url='https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
                status='PENDING'
            )
            self.stdout.write(self.style.SUCCESS("Created verification request for alex_student"))

        if jordan_user and not IdentityVerificationRequest.objects.filter(user=jordan_user).exists():
            IdentityVerificationRequest.objects.create(
                user=jordan_user,
                document_type='EMPLOYMENT_PROOF',
                document_number_or_info='BLK-CORP-ID-4421',
                institution_name='BlackRock / Wharton School',
                notes='Corporate credential email confirmation and alumni degree audit.',
                document_file_url='https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
                status='PENDING'
            )
            self.stdout.write(self.style.SUCCESS("Created verification request for jordan_finance"))

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully! All accounts use password: password123"))
