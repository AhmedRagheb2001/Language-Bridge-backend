--
-- PostgreSQL database dump
--

\restrict Ct4OolF0M33IYLVXRXgHEnYYlfrBgndjmaMH5Y1eX5O8zx5Xk618Nwzg6x7YTCQ

-- Dumped from database version 18.4 (Debian 18.4-1.pgdg13+1)
-- Dumped by pg_dump version 18.4 (Debian 18.4-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."RefreshToken" DROP CONSTRAINT IF EXISTS "RefreshToken_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Profile" DROP CONSTRAINT IF EXISTS "Profile_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Post" DROP CONSTRAINT IF EXISTS "Post_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Notification" DROP CONSTRAINT IF EXISTS "Notification_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Message" DROP CONSTRAINT IF EXISTS "Message_senderId_fkey";
ALTER TABLE IF EXISTS ONLY public."Message" DROP CONSTRAINT IF EXISTS "Message_chatId_fkey";
ALTER TABLE IF EXISTS ONLY public."Like" DROP CONSTRAINT IF EXISTS "Like_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Like" DROP CONSTRAINT IF EXISTS "Like_postId_fkey";
ALTER TABLE IF EXISTS ONLY public."Friendship" DROP CONSTRAINT IF EXISTS "Friendship_user2Id_fkey";
ALTER TABLE IF EXISTS ONLY public."Friendship" DROP CONSTRAINT IF EXISTS "Friendship_user1Id_fkey";
ALTER TABLE IF EXISTS ONLY public."FriendRequest" DROP CONSTRAINT IF EXISTS "FriendRequest_senderId_fkey";
ALTER TABLE IF EXISTS ONLY public."FriendRequest" DROP CONSTRAINT IF EXISTS "FriendRequest_receiverId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_postId_fkey";
ALTER TABLE IF EXISTS ONLY public."Chat" DROP CONSTRAINT IF EXISTS "Chat_user2Id_fkey";
ALTER TABLE IF EXISTS ONLY public."Chat" DROP CONSTRAINT IF EXISTS "Chat_user1Id_fkey";
ALTER TABLE IF EXISTS ONLY public."AuthAccount" DROP CONSTRAINT IF EXISTS "AuthAccount_userId_fkey";
DROP INDEX IF EXISTS public."User_username_key";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."RefreshToken_token_key";
DROP INDEX IF EXISTS public."Profile_userId_key";
DROP INDEX IF EXISTS public."Like_postId_userId_key";
DROP INDEX IF EXISTS public."Friendship_user1Id_user2Id_key";
DROP INDEX IF EXISTS public."FriendRequest_senderId_receiverId_key";
DROP INDEX IF EXISTS public."Chat_user1Id_user2Id_key";
DROP INDEX IF EXISTS public."AuthAccount_provider_providerAccountId_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."RefreshToken" DROP CONSTRAINT IF EXISTS "RefreshToken_pkey";
ALTER TABLE IF EXISTS ONLY public."Profile" DROP CONSTRAINT IF EXISTS "Profile_pkey";
ALTER TABLE IF EXISTS ONLY public."Post" DROP CONSTRAINT IF EXISTS "Post_pkey";
ALTER TABLE IF EXISTS ONLY public."Notification" DROP CONSTRAINT IF EXISTS "Notification_pkey";
ALTER TABLE IF EXISTS ONLY public."Message" DROP CONSTRAINT IF EXISTS "Message_pkey";
ALTER TABLE IF EXISTS ONLY public."Like" DROP CONSTRAINT IF EXISTS "Like_pkey";
ALTER TABLE IF EXISTS ONLY public."Friendship" DROP CONSTRAINT IF EXISTS "Friendship_pkey";
ALTER TABLE IF EXISTS ONLY public."FriendRequest" DROP CONSTRAINT IF EXISTS "FriendRequest_pkey";
ALTER TABLE IF EXISTS ONLY public."Comment" DROP CONSTRAINT IF EXISTS "Comment_pkey";
ALTER TABLE IF EXISTS ONLY public."Chat" DROP CONSTRAINT IF EXISTS "Chat_pkey";
ALTER TABLE IF EXISTS ONLY public."AuthAccount" DROP CONSTRAINT IF EXISTS "AuthAccount_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."RefreshToken";
DROP TABLE IF EXISTS public."Profile";
DROP TABLE IF EXISTS public."Post";
DROP TABLE IF EXISTS public."Notification";
DROP TABLE IF EXISTS public."Message";
DROP TABLE IF EXISTS public."Like";
DROP TABLE IF EXISTS public."Friendship";
DROP TABLE IF EXISTS public."FriendRequest";
DROP TABLE IF EXISTS public."Comment";
DROP TABLE IF EXISTS public."Chat";
DROP TABLE IF EXISTS public."AuthAccount";
DROP TYPE IF EXISTS public."Role";
DROP TYPE IF EXISTS public."NotificationType";
DROP TYPE IF EXISTS public."Language";
DROP TYPE IF EXISTS public."FriendRequestStatus";
--
-- Name: FriendRequestStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."FriendRequestStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'CANCELED'
);


ALTER TYPE public."FriendRequestStatus" OWNER TO postgres;

--
-- Name: Language; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Language" AS ENUM (
    'ENGLISH',
    'SPANISH',
    'FRENCH',
    'ARABIC',
    'TURKISH'
);


ALTER TYPE public."Language" OWNER TO postgres;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationType" AS ENUM (
    'FRIEND_REQUEST',
    'MESSAGE',
    'POST_LIKE',
    'POST_COMMENT'
);


ALTER TYPE public."NotificationType" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AuthAccount; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuthAccount" (
    id text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AuthAccount" OWNER TO postgres;

--
-- Name: Chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Chat" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "user1Id" text NOT NULL,
    "user2Id" text NOT NULL
);


ALTER TABLE public."Chat" OWNER TO postgres;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    content text NOT NULL,
    "postId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Comment" OWNER TO postgres;

--
-- Name: FriendRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FriendRequest" (
    id text NOT NULL,
    "senderId" text NOT NULL,
    "receiverId" text NOT NULL,
    status public."FriendRequestStatus" DEFAULT 'PENDING'::public."FriendRequestStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FriendRequest" OWNER TO postgres;

--
-- Name: Friendship; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Friendship" (
    id text NOT NULL,
    "user1Id" text NOT NULL,
    "user2Id" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Friendship" OWNER TO postgres;

--
-- Name: Like; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Like" (
    id text NOT NULL,
    "postId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Like" OWNER TO postgres;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "chatId" text NOT NULL,
    "senderId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."NotificationType" NOT NULL,
    content text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Post" (
    id text NOT NULL,
    title text NOT NULL,
    content text,
    "postPictureUrl" text,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Post" OWNER TO postgres;

--
-- Name: Profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Profile" (
    id text NOT NULL,
    "displayName" text NOT NULL,
    bio text,
    "profilePictureUrl" text,
    "nativeLanguage" public."Language" NOT NULL,
    "learningLanguage" public."Language" NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Profile" OWNER TO postgres;

--
-- Name: RefreshToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RefreshToken" (
    id text NOT NULL,
    token text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    revoked boolean DEFAULT false NOT NULL
);


ALTER TABLE public."RefreshToken" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    username text NOT NULL,
    email text NOT NULL,
    password text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: AuthAccount; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuthAccount" (id, provider, "providerAccountId", "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Chat" (id, "createdAt", "updatedAt", "user1Id", "user2Id") FROM stdin;
b2224a6f-d0d4-437b-bcc4-3b39cd8bca97	2026-08-06 10:12:12.011	2026-08-06 10:12:12.011	3bddd504-6ab0-405a-9ec9-43ffcdf1e690	b3d5e422-0625-4743-bd12-0c07a2a5d90d
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comment" (id, content, "postId", "userId", "createdAt", "updatedAt") FROM stdin;
2a72e557-1470-4b52-a2e2-83123b722d9e	Ok let's go	66916c90-7138-43d2-8c89-1de3e352bcf3	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-08-01 22:00:05.846	2026-08-01 22:02:52.286
6983c7b3-5cfa-485b-baa7-73fbb1ef55fd	Why not	66916c90-7138-43d2-8c89-1de3e352bcf3	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-08-01 22:03:51.805	2026-08-01 22:03:51.805
2b4f96de-6150-488e-96f3-8d7b265d8121	Ok , i am ready	57f38c3f-8a17-4be0-97af-7d1b9d13d7ac	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-08-02 10:50:13.475	2026-08-02 10:50:13.475
1dbeea84-51dc-45db-9c61-b9790ba7023b	Wow	57f38c3f-8a17-4be0-97af-7d1b9d13d7ac	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-08-05 11:21:16.63	2026-08-05 11:21:16.63
\.


--
-- Data for Name: FriendRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FriendRequest" (id, "senderId", "receiverId", status, "createdAt", "updatedAt") FROM stdin;
ff68f078-3cb7-4828-984a-87b0b2d11bd8	b3d5e422-0625-4743-bd12-0c07a2a5d90d	40ef3f5b-7bff-477a-88e0-b2ad7dc43172	PENDING	2026-08-03 16:09:31.311	2026-08-03 16:09:31.311
670061ee-1ddb-4d08-a7f7-51b382d778cc	3bddd504-6ab0-405a-9ec9-43ffcdf1e690	b3d5e422-0625-4743-bd12-0c07a2a5d90d	REJECTED	2026-08-03 21:18:23.816	2026-08-03 21:25:12.976
ba4306bc-53fe-4bfa-ad42-ba47927fb542	b3d5e422-0625-4743-bd12-0c07a2a5d90d	3bddd504-6ab0-405a-9ec9-43ffcdf1e690	ACCEPTED	2026-08-05 18:04:44.756	2026-08-05 18:06:18.794
\.


--
-- Data for Name: Friendship; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Friendship" (id, "user1Id", "user2Id", "createdAt") FROM stdin;
16ca0747-dd43-4da4-8c45-c21d56f20dbd	3bddd504-6ab0-405a-9ec9-43ffcdf1e690	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-08-05 18:06:18.803
\.


--
-- Data for Name: Like; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Like" (id, "postId", "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, "chatId", "senderId", content, "createdAt", "updatedAt") FROM stdin;
3b50bfc9-53ba-4718-94d1-3d90a8d42ab0	b2224a6f-d0d4-437b-bcc4-3b39cd8bca97	b3d5e422-0625-4743-bd12-0c07a2a5d90d	How are today ?	2026-08-06 10:17:50.837	2026-08-06 10:17:50.837
2d26a8ca-59ad-4043-87f3-bbdb8fbe14f3	b2224a6f-d0d4-437b-bcc4-3b39cd8bca97	b3d5e422-0625-4743-bd12-0c07a2a5d90d	Do you want to hang out together today ?	2026-08-06 10:19:33.332	2026-08-06 10:54:58.618
6b56421f-5a7b-4849-9eea-8131aed62173	b2224a6f-d0d4-437b-bcc4-3b39cd8bca97	b3d5e422-0625-4743-bd12-0c07a2a5d90d	Hi	2026-08-06 11:35:17.969	2026-08-06 11:35:17.969
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "userId", type, content, "isRead", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Post" (id, title, content, "postPictureUrl", "userId", "createdAt", "updatedAt") FROM stdin;
66916c90-7138-43d2-8c89-1de3e352bcf3	Learning New Language	I want to practice Turkish on Monday	\N	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-08-01 14:37:58.83	2026-08-01 14:37:58.83
57f38c3f-8a17-4be0-97af-7d1b9d13d7ac	Practicing Languages	Hi guys , Let's meet on Monday	\N	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-08-01 14:39:28.269	2026-08-01 14:39:28.269
\.


--
-- Data for Name: Profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Profile" (id, "displayName", bio, "profilePictureUrl", "nativeLanguage", "learningLanguage", "userId", "createdAt", "updatedAt") FROM stdin;
7bf52225-3939-4110-bb5d-9536e2b09ed5	Ahmed	\N	\N	ENGLISH	TURKISH	40ef3f5b-7bff-477a-88e0-b2ad7dc43172	2026-07-31 08:25:00.658	2026-07-31 08:25:00.658
08b9ed22-4472-4e32-9c68-c6e5a5c094f7	Mohammed	\N	\N	ARABIC	TURKISH	3bddd504-6ab0-405a-9ec9-43ffcdf1e690	2026-08-03 16:16:02.279	2026-08-03 16:16:02.279
60e251fc-43ef-4054-aa7a-2032b22acba0	aragheb	Hi, I am Ahmed Ragheb the developer of this API	\N	ARABIC	TURKISH	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-07-30 10:59:52.21	2026-08-06 12:38:22.452
\.


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RefreshToken" (id, token, "userId", "createdAt", "updatedAt", "expiresAt", revoked) FROM stdin;
2164e5c9-e895-44bc-b4ff-c96ece0cbb56	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiZGRkNTA0LTZhYjAtNDA1YS05ZWM5LTQzZmZjZGYxZTY5MCIsImlhdCI6MTc4NjExMDk4NSwiZXhwIjoxNzg2NzE1Nzg1fQ.SzLCesLXskxNrs4F0RfDYdVf3nlyUpot0POdDLfrHGk	3bddd504-6ab0-405a-9ec9-43ffcdf1e690	2026-08-07 13:56:25.873	2026-08-07 13:56:25.873	2026-08-14 13:56:25.844	f
3c48e400-9b04-46e7-a266-cb8259803c34	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiZGRkNTA0LTZhYjAtNDA1YS05ZWM5LTQzZmZjZGYxZTY5MCIsImlhdCI6MTc4NjExMTExMiwiZXhwIjoxNzg2NzE1OTEyfQ.QjtoRF8SAgkWy00kU8t1sra8htFHX1zEJQ1zkxF8gvQ	3bddd504-6ab0-405a-9ec9-43ffcdf1e690	2026-08-07 13:58:32.217	2026-08-07 13:58:32.217	2026-08-14 13:58:32.216	f
53f7209b-464b-4f11-a519-cbf1f326a59c	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiZGRkNTA0LTZhYjAtNDA1YS05ZWM5LTQzZmZjZGYxZTY5MCIsImlhdCI6MTc4NjExMTE4NSwiZXhwIjoxNzg2NzE1OTg1fQ.DntRb_nL832FfBFw5nA0cGGyvwgW5_Ni5jc5hKaqCck	3bddd504-6ab0-405a-9ec9-43ffcdf1e690	2026-08-07 13:59:45.693	2026-08-07 13:59:45.693	2026-08-14 13:59:45.665	f
2cf98655-725e-4fbf-903d-4c982afced15	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiZGRkNTA0LTZhYjAtNDA1YS05ZWM5LTQzZmZjZGYxZTY5MCIsImlhdCI6MTc4NjExMTQ0OCwiZXhwIjoxNzg2NzE2MjQ4fQ.qTUOAckq2vCxzmT2o_qE7g90HNyoTtBo1vtTVXgtqLs	3bddd504-6ab0-405a-9ec9-43ffcdf1e690	2026-08-07 14:04:08.095	2026-08-07 14:04:08.095	2026-08-14 14:04:08.094	f
a71afcfd-dafc-49b7-b9f5-b3f982b2085e	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiZGRkNTA0LTZhYjAtNDA1YS05ZWM5LTQzZmZjZGYxZTY5MCIsImlhdCI6MTc4NjExMTcxMCwiZXhwIjoxNzg2NzE2NTEwfQ.K0EmV2uD_iXiv9Rgq1iUQMHUXO-hVqx2CDjcik8YfMg	3bddd504-6ab0-405a-9ec9-43ffcdf1e690	2026-08-07 14:08:30.074	2026-08-07 14:08:30.074	2026-08-14 14:08:30.061	f
12695acf-e4fe-4e69-95e5-50acca706f2b	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiZGRkNTA0LTZhYjAtNDA1YS05ZWM5LTQzZmZjZGYxZTY5MCIsImlhdCI6MTc4NjExMTgwNiwiZXhwIjoxNzg2NzE2NjA2fQ.JiIceodiGpQiNYLk2UguaJWR56gnIbgtRpPtTVxYGtM	3bddd504-6ab0-405a-9ec9-43ffcdf1e690	2026-08-07 14:10:07.009	2026-08-07 14:10:07.009	2026-08-14 14:10:06.996	f
884110bd-5d1f-4b83-b350-a17de269adbc	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIzZDVlNDIyLTA2MjUtNDc0My1iZDEyLTBjMDdhMmE1ZDkwZCIsImlhdCI6MTc4NjExNTQ2MSwiZXhwIjoxNzg2NzIwMjYxfQ.5ISzmG_XN5F8s7DA_vkhbH0ROZSgjCEEDSHP8wwFpp4	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-08-07 15:11:02.009	2026-08-07 15:11:02.009	2026-08-14 15:11:01.992	f
192427d9-240a-4f42-bf20-5041803a8907	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIzZDVlNDIyLTA2MjUtNDc0My1iZDEyLTBjMDdhMmE1ZDkwZCIsImlhdCI6MTc4NjExNTU2MywiZXhwIjoxNzg2NzIwMzYzfQ.Z4m5f6MZoCr0V_Z3A58Bfe0-UxX58Fmt61jqy659PbQ	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-08-07 15:12:43.269	2026-08-07 15:12:43.269	2026-08-14 15:12:43.269	f
bae0b72c-7f81-4433-8323-343b08c820d0	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIzZDVlNDIyLTA2MjUtNDc0My1iZDEyLTBjMDdhMmE1ZDkwZCIsImlhdCI6MTc4NjExNTY0NCwiZXhwIjoxNzg2NzIwNDQ0fQ.E-vOE7cpehiQS6EjwFyfpBbdZmVfcJB-VBXv8QqbE3g	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-08-07 15:14:04.714	2026-08-07 15:14:04.714	2026-08-14 15:14:04.7	f
8ff55170-548c-4b74-8f17-2818dbdfaa94	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIzZDVlNDIyLTA2MjUtNDc0My1iZDEyLTBjMDdhMmE1ZDkwZCIsImlhdCI6MTc4NjExNTk4NSwiZXhwIjoxNzg2NzIwNzg1fQ.fZkFs2BEegcM7ElJH1LKgmk18HxlSOL8CI06wWy-fvs	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-08-07 15:19:45.565	2026-08-07 15:20:47.728	2026-08-14 15:19:45.554	t
be764e94-842d-4e19-b172-9cb33d016206	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIzZDVlNDIyLTA2MjUtNDc0My1iZDEyLTBjMDdhMmE1ZDkwZCIsImlhdCI6MTc4NjE5MzE1NywiZXhwIjoxNzg2Nzk3OTU3fQ.3NgGvjUWAQ7EW-xeTe9g7calXafYlsSWTHdOaBr6ahk	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-08-08 12:45:57.76	2026-08-08 12:45:57.76	2026-08-15 12:45:57.747	f
0fb937bd-9452-4f27-acfb-9153fa06df2f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIzZDVlNDIyLTA2MjUtNDc0My1iZDEyLTBjMDdhMmE1ZDkwZCIsImlhdCI6MTc4NjE5MzMwNCwiZXhwIjoxNzg2Nzk4MTA0fQ.rWQ1Y7FbZDIwkODoUCKB-8SS9qD6JcmaHE3nlz_0xLU	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-08-08 12:48:24.686	2026-08-08 12:48:24.686	2026-08-15 12:48:24.674	f
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (username, email, password, role, "createdAt", id, "updatedAt") FROM stdin;
Ahmed2001	aragheb@baucyprus.edu.tr	$2b$10$hZML3hfJB4LQQyW0wCkPjeqw1PvDqwgvgyJxku/YTDBtHA8hsc8Nu	ADMIN	2026-07-30 10:59:52.21	b3d5e422-0625-4743-bd12-0c07a2a5d90d	2026-07-30 10:59:52.21
Ali2001	aragheb@gmail.com	$2b$10$CyLHKkBleWlX5wXWzlVL4e0XxBAYn/MX7HLEPtNtQ9ahmiKhg.nxe	USER	2026-07-31 08:25:00.658	40ef3f5b-7bff-477a-88e0-b2ad7dc43172	2026-07-31 08:25:00.658
Mohammed2005	Mohammed2005@gmail.com	$2b$10$R9uKtVfCHfNGrihtUZE8EOMpueT5HoMdfpHUuTkJIIH8q2iuPh9gW	USER	2026-08-03 16:16:02.279	3bddd504-6ab0-405a-9ec9-43ffcdf1e690	2026-08-03 16:16:02.279
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
be5a1ca9-5bbd-4a23-8770-4a037750a720	3905141bf7b829ade9711ef8369cef2d2a4444c2c5e35f162c0e36fe7db2ec3e	2026-07-28 16:51:03.24126+00	20260728165103_init	\N	\N	2026-07-28 16:51:03.204832+00	1
83bc0370-0897-496a-815f-005c047b5ebe	76ecb89568c0a6b2a49be8d97f2a46e507b0b325a9b568eca4e20ce55bb69e26	2026-07-29 18:17:06.416571+00	20260729181706_database_schema	\N	\N	2026-07-29 18:17:06.1315+00	1
b6bb082b-1979-4871-b1fa-b65f8b3f8202	b60b1e47db1bb1c486273fd34ec24ffb1bdbae43ab5f65874bd0869efb7336ae	2026-08-05 17:33:36.609493+00	20260805173336_change_chat_relationship	\N	\N	2026-08-05 17:33:36.560843+00	1
5d063098-876d-4f83-b90d-77335009ffa7	92a85f9ab5411a49ceec450855acf7b01a14506b36cde1a7e2d60d04a175313e	2026-08-07 11:20:47.569789+00	20260807112047_create_referesh_token_model	\N	\N	2026-08-07 11:20:47.526243+00	1
2a1c2778-3f09-4923-99ab-a5f53cea85fd	04be5399003f7db397c0e193667ad55eb3d21f81b01bd48131d8f9857a5243f0	2026-08-07 13:54:41.952358+00	20260807135441_modified_refresh_token_model	\N	\N	2026-08-07 13:54:41.933583+00	1
\.


--
-- Name: AuthAccount AuthAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuthAccount"
    ADD CONSTRAINT "AuthAccount_pkey" PRIMARY KEY (id);


--
-- Name: Chat Chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: FriendRequest FriendRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_pkey" PRIMARY KEY (id);


--
-- Name: Friendship Friendship_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "Friendship_pkey" PRIMARY KEY (id);


--
-- Name: Like Like_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: Profile Profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_pkey" PRIMARY KEY (id);


--
-- Name: RefreshToken RefreshToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AuthAccount_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AuthAccount_provider_providerAccountId_key" ON public."AuthAccount" USING btree (provider, "providerAccountId");


--
-- Name: Chat_user1Id_user2Id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Chat_user1Id_user2Id_key" ON public."Chat" USING btree ("user1Id", "user2Id");


--
-- Name: FriendRequest_senderId_receiverId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON public."FriendRequest" USING btree ("senderId", "receiverId");


--
-- Name: Friendship_user1Id_user2Id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Friendship_user1Id_user2Id_key" ON public."Friendship" USING btree ("user1Id", "user2Id");


--
-- Name: Like_postId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Like_postId_userId_key" ON public."Like" USING btree ("postId", "userId");


--
-- Name: Profile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Profile_userId_key" ON public."Profile" USING btree ("userId");


--
-- Name: RefreshToken_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RefreshToken_token_key" ON public."RefreshToken" USING btree (token);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: AuthAccount AuthAccount_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuthAccount"
    ADD CONSTRAINT "AuthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Chat Chat_user1Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Chat Chat_user2Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FriendRequest FriendRequest_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FriendRequest FriendRequest_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Friendship Friendship_user1Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "Friendship_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Friendship Friendship_user2Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "Friendship_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Like Like_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Like Like_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Like"
    ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_chatId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES public."Chat"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Post Post_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Profile Profile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RefreshToken RefreshToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict Ct4OolF0M33IYLVXRXgHEnYYlfrBgndjmaMH5Y1eX5O8zx5Xk618Nwzg6x7YTCQ

