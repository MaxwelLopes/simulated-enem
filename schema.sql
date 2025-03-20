--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: maxwel
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO maxwel;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: maxwel
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: maxwel
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Category" OWNER TO maxwel;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: maxwel
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Category_id_seq" OWNER TO maxwel;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: maxwel
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: Discipline; Type: TABLE; Schema: public; Owner: maxwel
--

CREATE TABLE public."Discipline" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Discipline" OWNER TO maxwel;

--
-- Name: Discipline_id_seq; Type: SEQUENCE; Schema: public; Owner: maxwel
--

CREATE SEQUENCE public."Discipline_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Discipline_id_seq" OWNER TO maxwel;

--
-- Name: Discipline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: maxwel
--

ALTER SEQUENCE public."Discipline_id_seq" OWNED BY public."Discipline".id;


--
-- Name: Question; Type: TABLE; Schema: public; Owner: maxwel
--

CREATE TABLE public."Question" (
    id integer NOT NULL,
    year character varying(4) NOT NULL,
    "disciplineId" integer,
    "subjectId" integer,
    context text,
    "alternativesIntroduction" text,
    "correctAlternative" character varying(1) NOT NULL,
    "alternativeA" text NOT NULL,
    "alternativeB" text NOT NULL,
    "alternativeC" text NOT NULL,
    "alternativeD" text NOT NULL,
    "alternativeE" text NOT NULL
);


ALTER TABLE public."Question" OWNER TO maxwel;

--
-- Name: Question_categories; Type: TABLE; Schema: public; Owner: maxwel
--

CREATE TABLE public."Question_categories" (
    "questionId" integer NOT NULL,
    "categoriesId" integer NOT NULL
);


ALTER TABLE public."Question_categories" OWNER TO maxwel;

--
-- Name: Question_id_seq; Type: SEQUENCE; Schema: public; Owner: maxwel
--

CREATE SEQUENCE public."Question_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Question_id_seq" OWNER TO maxwel;

--
-- Name: Question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: maxwel
--

ALTER SEQUENCE public."Question_id_seq" OWNED BY public."Question".id;


--
-- Name: Simulated; Type: TABLE; Schema: public; Owner: maxwel
--

CREATE TABLE public."Simulated" (
    id integer NOT NULL,
    type character varying(100) NOT NULL,
    "userId" uuid NOT NULL,
    "createdAt" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "finishedAt" timestamp(0) without time zone,
    status character varying(20) NOT NULL,
    review boolean DEFAULT false,
    unseen boolean DEFAULT false,
    subtype character varying(200)[],
    "correctAnswers" integer DEFAULT 0 NOT NULL,
    "totalQuestions" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Simulated" OWNER TO maxwel;

--
-- Name: Simulated_id_seq; Type: SEQUENCE; Schema: public; Owner: maxwel
--

CREATE SEQUENCE public."Simulated_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Simulated_id_seq" OWNER TO maxwel;

--
-- Name: Simulated_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: maxwel
--

ALTER SEQUENCE public."Simulated_id_seq" OWNED BY public."Simulated".id;


--
-- Name: Simulated_questions; Type: TABLE; Schema: public; Owner: maxwel
--

CREATE TABLE public."Simulated_questions" (
    "simulatedId" integer NOT NULL,
    "questionId" integer NOT NULL,
    hit boolean,
    "createdAt" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastSeenAt" timestamp(0) without time zone,
    response text
);


ALTER TABLE public."Simulated_questions" OWNER TO maxwel;

--
-- Name: Subject; Type: TABLE; Schema: public; Owner: maxwel
--

CREATE TABLE public."Subject" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Subject" OWNER TO maxwel;

--
-- Name: Subject_id_seq; Type: SEQUENCE; Schema: public; Owner: maxwel
--

CREATE SEQUENCE public."Subject_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Subject_id_seq" OWNER TO maxwel;

--
-- Name: Subject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: maxwel
--

ALTER SEQUENCE public."Subject_id_seq" OWNED BY public."Subject".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: maxwel
--

CREATE TABLE public."User" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO maxwel;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: maxwel
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


ALTER TABLE public._prisma_migrations OWNER TO maxwel;

--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: Discipline id; Type: DEFAULT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Discipline" ALTER COLUMN id SET DEFAULT nextval('public."Discipline_id_seq"'::regclass);


--
-- Name: Question id; Type: DEFAULT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Question" ALTER COLUMN id SET DEFAULT nextval('public."Question_id_seq"'::regclass);


--
-- Name: Simulated id; Type: DEFAULT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Simulated" ALTER COLUMN id SET DEFAULT nextval('public."Simulated_id_seq"'::regclass);


--
-- Name: Subject id; Type: DEFAULT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Subject" ALTER COLUMN id SET DEFAULT nextval('public."Subject_id_seq"'::regclass);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Discipline Discipline_pkey; Type: CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Discipline"
    ADD CONSTRAINT "Discipline_pkey" PRIMARY KEY (id);


--
-- Name: Question_categories Question_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Question_categories"
    ADD CONSTRAINT "Question_categories_pkey" PRIMARY KEY ("questionId", "categoriesId");


--
-- Name: Question Question_pkey; Type: CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_pkey" PRIMARY KEY (id);


--
-- Name: Simulated Simulated_pkey; Type: CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Simulated"
    ADD CONSTRAINT "Simulated_pkey" PRIMARY KEY (id);


--
-- Name: Simulated_questions Simulated_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Simulated_questions"
    ADD CONSTRAINT "Simulated_questions_pkey" PRIMARY KEY ("simulatedId", "questionId");


--
-- Name: Subject Subject_pkey; Type: CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: maxwel
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Discipline_name_key; Type: INDEX; Schema: public; Owner: maxwel
--

CREATE UNIQUE INDEX "Discipline_name_key" ON public."Discipline" USING btree (name);


--
-- Name: Subject_name_key; Type: INDEX; Schema: public; Owner: maxwel
--

CREATE UNIQUE INDEX "Subject_name_key" ON public."Subject" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: maxwel
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Question_categories Question_categories_categoriesId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Question_categories"
    ADD CONSTRAINT "Question_categories_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Question_categories Question_categories_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Question_categories"
    ADD CONSTRAINT "Question_categories_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Question Question_disciplineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES public."Discipline"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Question Question_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Question"
    ADD CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Simulated_questions Simulated_questions_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Simulated_questions"
    ADD CONSTRAINT "Simulated_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."Question"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Simulated_questions Simulated_questions_simulatedId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Simulated_questions"
    ADD CONSTRAINT "Simulated_questions_simulatedId_fkey" FOREIGN KEY ("simulatedId") REFERENCES public."Simulated"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Simulated Simulated_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: maxwel
--

ALTER TABLE ONLY public."Simulated"
    ADD CONSTRAINT "Simulated_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: maxwel
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

