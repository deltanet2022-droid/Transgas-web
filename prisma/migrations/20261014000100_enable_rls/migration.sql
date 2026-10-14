-- Seguridad en Supabase: las tablas del schema "public" quedan expuestas por la API REST
-- (PostgREST) con la clave anon. Habilitar RLS SIN políticas las deja inaccesibles para
-- los roles anon/authenticated. La app accede con el rol "postgres" (dueño de las tablas),
-- que no se ve afectado por RLS. En un Postgres común esta migración es inofensiva.

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tariffs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tariff_documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "news" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "due_dates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cooperatives" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "licensed_installers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "faqs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "service_status" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chat_conversations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chat_messages" ENABLE ROW LEVEL SECURITY;
