import 'dotenv/config';
import { hash } from 'bcryptjs';
import { and, eq } from 'drizzle-orm';
import { formatBrazilianPhone, normalizeBrazilianPhone } from '@/lib/validators/brazilian-phone.js';
import { db, pool } from '@/db/index.js';
import { serializeTags } from '@/modules/projects/lib/tags.js';
import { budgets } from '@/db/schema/budgets.js';
import { projects } from '@/db/schema/projects.js';
import { roles } from '@/db/schema/roles.js';
import { users } from '@/db/schema/users.js';

const ROLES_SEED = [
  { name: 'admin', description: 'Acesso total ao sistema' },
  { name: 'manager', description: 'Gerencia equipes e relatórios' },
  { name: 'user', description: 'Acesso padrão' },
] as const;

const USERS_SEED = [
  {
    email: 'admin@wltech.dev',
    name: 'Admin WL Tech',
    password: 'dev123',
    roleName: 'admin',
  },
  {
    email: 'manager@wltech.dev',
    name: 'Manager WL Tech',
    password: 'dev123',
    roleName: 'manager',
  },
  {
    email: 'user@wltech.dev',
    name: 'User WL Tech',
    password: 'dev123',
    roleName: 'user',
  },
] as const;

const BUDGETS_SEED = [
  {
    name: 'Ana Costa',
    email: 'ana.costa@startup.com',
    phone: '(11) 98888-7777',
    name_app: 'FoodFlow',
    description_project:
      'Aplicativo de delivery para restaurantes locais com rastreamento em tempo real e pagamento integrado.',
    platform: 'iOS e Android',
    delivery_time: '4 meses',
    main_features: 'Cadastro, cardápio, carrinho, checkout, rastreamento de pedidos',
    budget_available: 'R$ 60.000 - R$ 90.000',
  },
  {
    name: 'Carlos Mendes',
    email: 'carlos.mendes@clinica.com',
    phone: '21987654321',
    name_app: 'Clínica Online',
    description_project:
      'Plataforma web para agendamento de consultas, prontuário simplificado e lembretes por e-mail.',
    platform: 'Web',
    delivery_time: '3 meses',
    main_features: 'Agenda médica, cadastro de pacientes, notificações, painel administrativo',
    budget_available: 'R$ 35.000 - R$ 50.000',
  },
  {
    name: 'Mariana Souza',
    email: 'mariana.souza@loja.com',
    phone: '+55 31 99999-1234',
    name_app: 'Loja VIP',
    description_project:
      'E-commerce com catálogo, cupons de desconto e integração com gateway de pagamento.',
    platform: 'Web e Android',
    delivery_time: '5 meses',
    main_features: 'Catálogo, carrinho, cupons, checkout, área do cliente',
    budget_available: 'R$ 80.000 - R$ 120.000',
  },
] as const;

const PROJECTS_SEED = [
  {
    name_project: 'FoodFlow',
    sub_title: 'Delivery para restaurantes',
    tags: ['React Native', 'Node.js', 'Delivery'],
    description:
      'Aplicativo completo de delivery com rastreamento em tempo real, painel administrativo e integração com pagamentos.',
    foto_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
  },
  {
    name_project: 'Clínica Online',
    sub_title: 'Agendamento médico simplificado',
    tags: ['Next.js', 'TypeScript', 'SaaS'],
    description:
      'Plataforma web para agendamento de consultas, prontuário simplificado e notificações automáticas para pacientes.',
    foto_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
  },
  {
    name_project: 'Loja VIP',
    sub_title: 'E-commerce com experiência premium',
    tags: ['Web', 'E-commerce', 'Stripe'],
    description:
      'Loja virtual com catálogo dinâmico, cupons de desconto, checkout otimizado e área exclusiva para clientes VIP.',
    foto_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  },
] as const;

async function seedRoles() {
  for (const role of ROLES_SEED) {
    await db
      .insert(roles)
      .values(role)
      .onConflictDoNothing({ target: roles.name });
  }
}

async function seedUsers() {
  const roleRows = await db.select().from(roles);
  const roleByName = Object.fromEntries(roleRows.map((r) => [r.name, r.id]));

  for (const user of USERS_SEED) {
    const roleId = roleByName[user.roleName];
    if (!roleId) {
      throw new Error(`Role not found: ${user.roleName}`);
    }

    const password_hash = await hash(user.password, 10);
    const existing = await db.select().from(users).where(eq(users.email, user.email));

    if (existing.length > 0) {
      await db
        .update(users)
        .set({
          name: user.name,
          password_hash,
          role_id: roleId,
          updated_at: new Date(),
        })
        .where(eq(users.email, user.email));
      console.log(`  updated user: ${user.email}`);
    } else {
      await db.insert(users).values({
        email: user.email,
        name: user.name,
        password_hash,
        role_id: roleId,
      });
      console.log(`  created user: ${user.email}`);
    }
  }
}

async function seedBudgets() {
  for (const budget of BUDGETS_SEED) {
    const phone = formatBrazilianPhone(normalizeBrazilianPhone(budget.phone));
    const existing = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.email, budget.email), eq(budgets.name_app, budget.name_app)));

    if (existing.length > 0) {
      await db
        .update(budgets)
        .set({
          name: budget.name,
          phone,
          description_project: budget.description_project,
          platform: budget.platform,
          delivery_time: budget.delivery_time,
          main_features: budget.main_features,
          budget_available: budget.budget_available,
        })
        .where(eq(budgets.id, existing[0].id));
      console.log(`  updated budget: ${budget.name_app} (${budget.email})`);
    } else {
      await db.insert(budgets).values({
        name: budget.name,
        email: budget.email,
        phone,
        name_app: budget.name_app,
        description_project: budget.description_project,
        platform: budget.platform,
        delivery_time: budget.delivery_time,
        main_features: budget.main_features,
        budget_available: budget.budget_available,
      });
      console.log(`  created budget: ${budget.name_app} (${budget.email})`);
    }
  }
}

async function seedProjects() {
  for (const project of PROJECTS_SEED) {
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.name_project, project.name_project));

    const values = {
      name_project: project.name_project,
      sub_title: project.sub_title,
      tags: serializeTags([...project.tags]),
      description: project.description,
      foto_url: project.foto_url,
      updated_at: new Date(),
    };

    if (existing.length > 0) {
      await db.update(projects).set(values).where(eq(projects.id, existing[0].id));
      console.log(`  updated project: ${project.name_project}`);
    } else {
      await db.insert(projects).values(values);
      console.log(`  created project: ${project.name_project}`);
    }
  }
}

async function seed() {
  console.log('Seeding database...');

  await seedRoles();
  await seedUsers();
  await seedBudgets();
  await seedProjects();

  console.log('Seed completed.');
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
