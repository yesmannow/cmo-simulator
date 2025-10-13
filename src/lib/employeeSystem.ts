// Employee System for CMO Simulator

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: 'marketing' | 'sales' | 'product' | 'finance' | 'operations' | 'hr';
  personality: 'analytical' | 'creative' | 'pragmatic' | 'optimistic' | 'cautious';
  expertise: string[];
  avatar?: string;
  quote?: string;
}

export interface TeamComposition {
  marketing: Employee[];
  sales: Employee[];
  product: Employee[];
  finance: Employee[];
  operations: Employee[];
  hr: Employee[];
}

// Pre-defined employee names and roles
const employeeNames = {
  marketing: [
    'Sarah Chen', 'Marcus Rodriguez', 'Elena Volkov', 'David Kim', 'Priya Patel',
    'James Wilson', 'Maria Santos', 'Ahmed Hassan', 'Lisa Thompson', 'Carlos Mendez'
  ],
  sales: [
    'Michael Torres', 'Jennifer Walsh', 'Robert Chang', 'Anna Kowalski', 'Thomas Anderson',
    'Rachel Green', 'Daniel Lee', 'Sophie Martin', 'Brian Johnson', 'Emma Davis'
  ],
  product: [
    'Alex Kumar', 'Natalie Zhang', 'Victor Petrov', 'Isabella Rossi', 'Oliver Smith',
    'Zoe Williams', 'Lucas Brown', 'Mia Garcia', 'Ethan Taylor', 'Ava Martinez'
  ],
  finance: [
    'Christopher Nolan', 'Amanda Foster', 'Jonathan Wright', 'Rebecca Hayes', 'Andrew Cooper',
    'Victoria Adams', 'Ryan Murphy', 'Samantha Turner', 'Tyler Bennett', 'Madison Brooks'
  ],
  operations: [
    'Kevin Liu', 'Heather Clark', 'Brandon Miller', 'Courtney Lewis', 'Justin Walker',
    'Tiffany Hall', 'Austin Young', 'Brittany King', 'Caleb Wright', 'Megan Lopez'
  ],
  hr: [
    'Nicole Rivera', 'Patrick Stewart', 'Erica Johnson', 'Jordan Mitchell', 'Taylor Morgan',
    'Morgan Phillips', 'Casey Reed', 'Riley Coleman', 'Quinn Parker', 'Avery Bennett'
  ]
};

const roleTemplates = {
  marketing: [
    'Digital Marketing Manager', 'Brand Manager', 'Content Strategist', 'SEO Specialist', 'Social Media Manager',
    'Marketing Analyst', 'Campaign Manager', 'Creative Director', 'Marketing Coordinator', 'Growth Hacker'
  ],
  sales: [
    'Sales Director', 'Account Executive', 'Business Development Manager', 'Sales Operations Manager',
    'Customer Success Manager', 'Regional Sales Manager', 'Sales Analyst', 'Partnership Manager'
  ],
  product: [
    'Product Manager', 'UX Designer', 'Product Designer', 'Product Analyst', 'Technical Product Manager',
    'Product Marketing Manager', 'User Researcher', 'Product Owner'
  ],
  finance: [
    'CFO', 'Financial Analyst', 'Budget Manager', 'Revenue Operations Manager', 'Financial Controller',
    'Investment Analyst', 'Risk Manager', 'Treasury Manager'
  ],
  operations: [
    'COO', 'Operations Manager', 'Supply Chain Manager', 'Project Manager', 'Quality Assurance Manager',
    'Process Improvement Manager', 'Logistics Manager', 'Facilities Manager'
  ],
  hr: [
    'HR Director', 'Talent Acquisition Manager', 'Employee Relations Manager', 'Training Manager',
    'Compensation Manager', 'HR Business Partner', 'Diversity & Inclusion Manager', 'HR Analyst'
  ]
};

const personalityTraits = {
  analytical: {
    traits: ['data-driven', 'methodical', 'precise', 'logical'],
    communication: 'focuses on metrics and ROI',
    perspective: 'emphasizes measurable outcomes'
  },
  creative: {
    traits: ['innovative', 'imaginative', 'bold', 'artistic'],
    communication: 'thinks outside the box',
    perspective: 'sees opportunities others miss'
  },
  pragmatic: {
    traits: ['practical', 'realistic', 'efficient', 'grounded'],
    communication: 'cuts through complexity',
    perspective: 'focuses on what works'
  },
  optimistic: {
    traits: ['positive', 'enthusiastic', 'motivational', 'energetic'],
    communication: 'sees potential in everything',
    perspective: 'believes in positive outcomes'
  },
  cautious: {
    traits: ['careful', 'risk-averse', 'thorough', 'conservative'],
    communication: 'considers all angles',
    perspective: 'prioritizes stability'
  }
};

const expertiseAreas = {
  marketing: [
    'Digital Advertising', 'Brand Strategy', 'Content Marketing', 'SEO/SEM', 'Social Media',
    'Marketing Analytics', 'Customer Journey', 'Conversion Optimization', 'Market Research'
  ],
  sales: [
    'Sales Strategy', 'Customer Acquisition', 'Account Management', 'Sales Analytics',
    'Partnership Development', 'Customer Success', 'Revenue Operations', 'Sales Training'
  ],
  product: [
    'Product Strategy', 'User Experience', 'Product Development', 'Market Fit',
    'Feature Prioritization', 'User Research', 'Product Analytics', 'Roadmap Planning'
  ],
  finance: [
    'Financial Planning', 'Budget Management', 'ROI Analysis', 'Cost Optimization',
    'Revenue Forecasting', 'Investment Analysis', 'Risk Assessment', 'Financial Reporting'
  ],
  operations: [
    'Process Optimization', 'Project Management', 'Supply Chain', 'Quality Control',
    'Operational Efficiency', 'Resource Allocation', 'Performance Metrics', 'Change Management'
  ],
  hr: [
    'Talent Management', 'Employee Development', 'Organizational Culture', 'Performance Management',
    'Recruitment Strategy', 'Employee Engagement', 'Leadership Development', 'HR Analytics'
  ]
};

// Generate a random employee
export const generateEmployee = (department: keyof typeof employeeNames): Employee => {
  const names = employeeNames[department];
  const roles = roleTemplates[department];
  const personalities = Object.keys(personalityTraits) as Array<keyof typeof personalityTraits>;
  const expertises = expertiseAreas[department];

  const name = names[Math.floor(Math.random() * names.length)];
  const role = roles[Math.floor(Math.random() * roles.length)];
  const personality = personalities[Math.floor(Math.random() * personalities.length)];

  // Select 2-3 random expertise areas
  const selectedExpertise = expertises
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 2) + 2);

  const personalityData = personalityTraits[personality];

  return {
    id: `${department}-${name.replace(' ', '-').toLowerCase()}`,
    name,
    role,
    department,
    personality,
    expertise: selectedExpertise,
    quote: `${name} brings a ${personalityData.traits[0]} approach to ${department} challenges.`
  };
};

// Generate a complete team for a company
export const generateTeam = (companyName: string): TeamComposition => {
  const team: TeamComposition = {
    marketing: [],
    sales: [],
    product: [],
    finance: [],
    operations: [],
    hr: []
  };

  // Generate 3-5 marketing team members (most important for CMO sim)
  const marketingCount = Math.floor(Math.random() * 3) + 3;
  for (let i = 0; i < marketingCount; i++) {
    team.marketing.push(generateEmployee('marketing'));
  }

  // Generate 2-3 for other departments
  const otherDepartments: Array<keyof TeamComposition> = ['sales', 'product', 'finance', 'operations', 'hr'];
  otherDepartments.forEach(dept => {
    const count = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < count; i++) {
      team[dept].push(generateEmployee(dept));
    }
  });

  return team;
};

// Get team member by role or department
export const getTeamMemberByRole = (team: TeamComposition, role: string): Employee | undefined => {
  for (const department of Object.values(team)) {
    const member = department.find(emp => emp.role === role);
    if (member) return member;
  }
  return undefined;
};

export const getTeamMembersByDepartment = (team: TeamComposition, department: keyof TeamComposition): Employee[] => {
  return team[department];
};

// Generate contextual commentary using team members
export const generateTeamContext = (team: TeamComposition, companyName: string): string => {
  const marketingLead = team.marketing[0]; // CMO's direct report
  const financeLead = team.finance[0]; // For budget discussions
  const salesLead = team.sales[0]; // For revenue discussions

  return `Your key team members at ${companyName} include ${marketingLead.name} (${marketingLead.role}), ${financeLead.name} (${financeLead.role}), and ${salesLead.name} (${salesLead.role}). Each brings unique expertise to help you succeed.`;
};

// Get personality-based response for a team member
export const getPersonalityResponse = (employee: Employee, situation: string): string => {
  const personality = personalityTraits[employee.personality];

  switch (situation) {
    case 'budget_discussion':
      if (employee.personality === 'analytical') {
        return `${employee.name}: "Let's look at the ROI projections and make data-driven decisions."`;
      }
      if (employee.personality === 'creative') {
        return `${employee.name}: "What if we tried an unconventional approach to maximize our budget impact?"`;
      }
      if (employee.personality === 'pragmatic') {
        return `${employee.name}: "Let's focus on what we know works and scale it efficiently."`;
      }
      break;

    case 'strategy_discussion':
      if (employee.personality === 'optimistic') {
        return `${employee.name}: "I see tremendous potential in this strategy - let's go for it!"`;
      }
      if (employee.personality === 'cautious') {
        return `${employee.name}: "We should thoroughly test this before full implementation."`;
      }
      break;
  }

  return `${employee.name} contributes valuable insights from their ${personality.traits[0]} perspective.`;
};
