--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Affiliate; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."Affiliate" (
    id integer NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    "trainingType" text NOT NULL,
    email text,
    phone text,
    iban text,
    "bankName" text,
    "ownerId" integer NOT NULL,
    logo text,
    "paymentHolidayFee" double precision,
    subdomain text
);


ALTER TABLE public."Affiliate" OWNER TO irontrackuser;

--
-- Name: AffiliateApiKeys; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."AffiliateApiKeys" (
    id integer NOT NULL,
    "affiliateId" integer NOT NULL,
    "accessKey" text NOT NULL,
    "secretKey" text NOT NULL
);


ALTER TABLE public."AffiliateApiKeys" OWNER TO irontrackuser;

--
-- Name: AffiliateApiKeys_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."AffiliateApiKeys_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AffiliateApiKeys_id_seq" OWNER TO irontrackuser;

--
-- Name: AffiliateApiKeys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."AffiliateApiKeys_id_seq" OWNED BY public."AffiliateApiKeys".id;


--
-- Name: AffiliateTrainer; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."AffiliateTrainer" (
    id integer NOT NULL,
    "affiliateId" integer NOT NULL,
    "trainerId" integer NOT NULL
);


ALTER TABLE public."AffiliateTrainer" OWNER TO irontrackuser;

--
-- Name: AffiliateTrainer_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."AffiliateTrainer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AffiliateTrainer_id_seq" OWNER TO irontrackuser;

--
-- Name: AffiliateTrainer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."AffiliateTrainer_id_seq" OWNED BY public."AffiliateTrainer".id;


--
-- Name: Affiliate_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."Affiliate_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Affiliate_id_seq" OWNER TO irontrackuser;

--
-- Name: Affiliate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."Affiliate_id_seq" OWNED BY public."Affiliate".id;


--
-- Name: ClassAttendee; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."ClassAttendee" (
    id integer NOT NULL,
    "classId" integer NOT NULL,
    "userId" integer NOT NULL,
    "userPlanId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "checkIn" boolean DEFAULT false NOT NULL,
    "affiliateId" integer NOT NULL
);


ALTER TABLE public."ClassAttendee" OWNER TO irontrackuser;

--
-- Name: ClassAttendee_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."ClassAttendee_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ClassAttendee_id_seq" OWNER TO irontrackuser;

--
-- Name: ClassAttendee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."ClassAttendee_id_seq" OWNED BY public."ClassAttendee".id;


--
-- Name: ClassLeaderboard; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."ClassLeaderboard" (
    id integer NOT NULL,
    "classId" integer NOT NULL,
    "userId" integer NOT NULL,
    "scoreType" text NOT NULL,
    score text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ClassLeaderboard" OWNER TO irontrackuser;

--
-- Name: ClassLeaderboard_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."ClassLeaderboard_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ClassLeaderboard_id_seq" OWNER TO irontrackuser;

--
-- Name: ClassLeaderboard_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."ClassLeaderboard_id_seq" OWNED BY public."ClassLeaderboard".id;


--
-- Name: ClassSchedule; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."ClassSchedule" (
    id integer NOT NULL,
    "trainingType" text,
    "trainingName" text NOT NULL,
    "time" timestamp(3) without time zone NOT NULL,
    duration integer NOT NULL,
    trainer text,
    "memberCapacity" integer NOT NULL,
    location text,
    "repeatWeekly" boolean DEFAULT false NOT NULL,
    "ownerId" integer NOT NULL,
    "affiliateId" integer NOT NULL,
    "seriesId" integer,
    "wodName" text,
    "wodType" text,
    description text,
    "canRegister" boolean DEFAULT true NOT NULL,
    "freeClass" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."ClassSchedule" OWNER TO irontrackuser;

--
-- Name: ClassSchedule_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."ClassSchedule_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ClassSchedule_id_seq" OWNER TO irontrackuser;

--
-- Name: ClassSchedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."ClassSchedule_id_seq" OWNED BY public."ClassSchedule".id;


--
-- Name: Contract; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."Contract" (
    id integer NOT NULL,
    "affiliateId" integer NOT NULL,
    "userId" integer NOT NULL,
    "contractType" text,
    content text NOT NULL,
    "paymentType" text,
    "paymentAmount" double precision,
    "paymentInterval" text,
    "paymentDay" integer,
    "validUntil" timestamp(3) without time zone,
    active boolean DEFAULT true NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "acceptedAt" timestamp(3) without time zone
);


ALTER TABLE public."Contract" OWNER TO irontrackuser;

--
-- Name: ContractLogs; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."ContractLogs" (
    id integer NOT NULL,
    "contractId" integer NOT NULL,
    "userId" integer NOT NULL,
    "affiliateId" integer NOT NULL,
    action text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ContractLogs" OWNER TO irontrackuser;

--
-- Name: ContractLogs_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."ContractLogs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ContractLogs_id_seq" OWNER TO irontrackuser;

--
-- Name: ContractLogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."ContractLogs_id_seq" OWNED BY public."ContractLogs".id;


--
-- Name: ContractTemplate; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."ContractTemplate" (
    id text NOT NULL,
    "affiliateId" integer NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ContractTemplate" OWNER TO irontrackuser;

--
-- Name: ContractTerms; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."ContractTerms" (
    id integer NOT NULL,
    type text NOT NULL,
    terms text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ContractTerms" OWNER TO irontrackuser;

--
-- Name: ContractTerms_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."ContractTerms_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ContractTerms_id_seq" OWNER TO irontrackuser;

--
-- Name: ContractTerms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."ContractTerms_id_seq" OWNED BY public."ContractTerms".id;


--
-- Name: Contract_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."Contract_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Contract_id_seq" OWNER TO irontrackuser;

--
-- Name: Contract_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."Contract_id_seq" OWNED BY public."Contract".id;


--
-- Name: Credit; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."Credit" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    credit double precision DEFAULT 0.0 NOT NULL,
    "affiliateId" integer NOT NULL
);


ALTER TABLE public."Credit" OWNER TO irontrackuser;

--
-- Name: Credit_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."Credit_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Credit_id_seq" OWNER TO irontrackuser;

--
-- Name: Credit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."Credit_id_seq" OWNED BY public."Credit".id;


--
-- Name: Exercise; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."Exercise" (
    id integer NOT NULL,
    "exerciseData" text,
    "trainingId" integer NOT NULL
);


ALTER TABLE public."Exercise" OWNER TO irontrackuser;

--
-- Name: Exercise_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."Exercise_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Exercise_id_seq" OWNER TO irontrackuser;

--
-- Name: Exercise_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."Exercise_id_seq" OWNED BY public."Exercise".id;


--
-- Name: Members; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."Members" (
    id integer NOT NULL,
    "affiliateId" integer NOT NULL,
    "userId" integer NOT NULL,
    "visitCount" integer DEFAULT 0,
    "addScoreCount" integer DEFAULT 0,
    "atRisk" boolean DEFAULT false NOT NULL,
    "ristData" text,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Members" OWNER TO irontrackuser;

--
-- Name: Members_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."Members_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Members_id_seq" OWNER TO irontrackuser;

--
-- Name: Members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."Members_id_seq" OWNED BY public."Members".id;


--
-- Name: Message; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    "affiliateId" integer NOT NULL,
    "recipientId" integer,
    subject text NOT NULL,
    "recipientType" text NOT NULL,
    body text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Message" OWNER TO irontrackuser;

--
-- Name: MessageGroup; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."MessageGroup" (
    id integer NOT NULL,
    "groupName" text NOT NULL,
    "affiliateId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MessageGroup" OWNER TO irontrackuser;

--
-- Name: MessageGroup_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."MessageGroup_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MessageGroup_id_seq" OWNER TO irontrackuser;

--
-- Name: MessageGroup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."MessageGroup_id_seq" OWNED BY public."MessageGroup".id;


--
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Message_id_seq" OWNER TO irontrackuser;

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- Name: PaymentHoliday; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."PaymentHoliday" (
    id integer NOT NULL,
    "contractId" integer NOT NULL,
    "userId" integer NOT NULL,
    "affiliateId" integer NOT NULL,
    month text NOT NULL,
    reason text,
    "monthlyFee" double precision DEFAULT 0.0 NOT NULL,
    accepted text DEFAULT 'pending'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PaymentHoliday" OWNER TO irontrackuser;

--
-- Name: PaymentHoliday_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."PaymentHoliday_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PaymentHoliday_id_seq" OWNER TO irontrackuser;

--
-- Name: PaymentHoliday_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."PaymentHoliday_id_seq" OWNED BY public."PaymentHoliday".id;


--
-- Name: Plan; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."Plan" (
    id integer NOT NULL,
    name text NOT NULL,
    "validityDays" integer NOT NULL,
    price double precision NOT NULL,
    "additionalData" text,
    sessions integer NOT NULL,
    "affiliateId" integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "ownerId" integer NOT NULL
);


ALTER TABLE public."Plan" OWNER TO irontrackuser;

--
-- Name: Plan_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."Plan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Plan_id_seq" OWNER TO irontrackuser;

--
-- Name: Plan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."Plan_id_seq" OWNED BY public."Plan".id;


--
-- Name: Record; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."Record" (
    id integer NOT NULL,
    type text,
    name text,
    date timestamp(3) without time zone,
    score text,
    weight double precision,
    "time" text,
    "userId" integer NOT NULL
);


ALTER TABLE public."Record" OWNER TO irontrackuser;

--
-- Name: Record_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."Record_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Record_id_seq" OWNER TO irontrackuser;

--
-- Name: Record_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."Record_id_seq" OWNED BY public."Record".id;


--
-- Name: SectorComment; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."SectorComment" (
    id integer NOT NULL,
    content text NOT NULL,
    "trainingDayId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SectorComment" OWNER TO irontrackuser;

--
-- Name: SectorComment_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."SectorComment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SectorComment_id_seq" OWNER TO irontrackuser;

--
-- Name: SectorComment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."SectorComment_id_seq" OWNED BY public."SectorComment".id;


--
-- Name: SectorYoutubeLink; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."SectorYoutubeLink" (
    id integer NOT NULL,
    url text NOT NULL,
    "trainingSectorId" integer NOT NULL
);


ALTER TABLE public."SectorYoutubeLink" OWNER TO irontrackuser;

--
-- Name: SectorYoutubeLink_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."SectorYoutubeLink_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SectorYoutubeLink_id_seq" OWNER TO irontrackuser;

--
-- Name: SectorYoutubeLink_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."SectorYoutubeLink_id_seq" OWNED BY public."SectorYoutubeLink".id;


--
-- Name: SignedContract; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."SignedContract" (
    id integer NOT NULL,
    "contractId" integer NOT NULL,
    "userId" integer NOT NULL,
    "affiliateId" integer NOT NULL,
    "acceptType" text NOT NULL,
    "contractTermsId" integer NOT NULL,
    "signedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SignedContract" OWNER TO irontrackuser;

--
-- Name: SignedContract_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."SignedContract_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SignedContract_id_seq" OWNER TO irontrackuser;

--
-- Name: SignedContract_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."SignedContract_id_seq" OWNED BY public."SignedContract".id;


--
-- Name: Training; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."Training" (
    id integer NOT NULL,
    type text NOT NULL,
    "wodName" text,
    "wodType" text,
    date timestamp(3) without time zone,
    score text,
    "userId" integer NOT NULL
);


ALTER TABLE public."Training" OWNER TO irontrackuser;

--
-- Name: TrainingDay; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."TrainingDay" (
    id integer NOT NULL,
    name text NOT NULL,
    "trainingPlanId" integer NOT NULL
);


ALTER TABLE public."TrainingDay" OWNER TO irontrackuser;

--
-- Name: TrainingDay_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."TrainingDay_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TrainingDay_id_seq" OWNER TO irontrackuser;

--
-- Name: TrainingDay_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."TrainingDay_id_seq" OWNED BY public."TrainingDay".id;


--
-- Name: TrainingPlan; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."TrainingPlan" (
    id integer NOT NULL,
    name text NOT NULL,
    "creatorId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TrainingPlan" OWNER TO irontrackuser;

--
-- Name: TrainingPlan_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."TrainingPlan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TrainingPlan_id_seq" OWNER TO irontrackuser;

--
-- Name: TrainingPlan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."TrainingPlan_id_seq" OWNED BY public."TrainingPlan".id;


--
-- Name: TrainingSector; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."TrainingSector" (
    id integer NOT NULL,
    type text NOT NULL,
    content text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "trainingDayId" integer NOT NULL
);


ALTER TABLE public."TrainingSector" OWNER TO irontrackuser;

--
-- Name: TrainingSector_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."TrainingSector_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TrainingSector_id_seq" OWNER TO irontrackuser;

--
-- Name: TrainingSector_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."TrainingSector_id_seq" OWNED BY public."TrainingSector".id;


--
-- Name: Training_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."Training_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Training_id_seq" OWNER TO irontrackuser;

--
-- Name: Training_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."Training_id_seq" OWNED BY public."Training".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "fullName" text,
    "emailConfirmed" boolean DEFAULT false NOT NULL,
    "verificationToken" text,
    "verificationExpires" timestamp(3) without time zone,
    "resetToken" text,
    "resetTokenExpires" timestamp(3) without time zone,
    "affiliateOwner" boolean DEFAULT false NOT NULL,
    "pricingPlan" text DEFAULT 'premium'::text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "monthlyGoal" integer,
    "isAcceptedTerms" boolean DEFAULT false NOT NULL,
    phone text,
    address text,
    logo text,
    "emergencyContact" text,
    "homeAffiliate" integer
);


ALTER TABLE public."User" OWNER TO irontrackuser;

--
-- Name: UserMessageGroup; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."UserMessageGroup" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "groupId" integer NOT NULL
);


ALTER TABLE public."UserMessageGroup" OWNER TO irontrackuser;

--
-- Name: UserMessageGroup_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."UserMessageGroup_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserMessageGroup_id_seq" OWNER TO irontrackuser;

--
-- Name: UserMessageGroup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."UserMessageGroup_id_seq" OWNED BY public."UserMessageGroup".id;


--
-- Name: UserNote; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."UserNote" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    note text NOT NULL,
    flag text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UserNote" OWNER TO irontrackuser;

--
-- Name: UserNote_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."UserNote_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserNote_id_seq" OWNER TO irontrackuser;

--
-- Name: UserNote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."UserNote_id_seq" OWNED BY public."UserNote".id;


--
-- Name: UserPlan; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."UserPlan" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "contractId" integer,
    "affiliateId" integer NOT NULL,
    "planId" integer NOT NULL,
    "planName" text NOT NULL,
    "validityDays" integer NOT NULL,
    price double precision NOT NULL,
    "purchasedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "sessionsLeft" integer NOT NULL
);


ALTER TABLE public."UserPlan" OWNER TO irontrackuser;

--
-- Name: UserPlan_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."UserPlan_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserPlan_id_seq" OWNER TO irontrackuser;

--
-- Name: UserPlan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."UserPlan_id_seq" OWNED BY public."UserPlan".id;


--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO irontrackuser;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Waitlist; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."Waitlist" (
    id integer NOT NULL,
    "classId" integer NOT NULL,
    "userId" integer NOT NULL,
    "userPlanId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Waitlist" OWNER TO irontrackuser;

--
-- Name: Waitlist_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."Waitlist_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Waitlist_id_seq" OWNER TO irontrackuser;

--
-- Name: Waitlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."Waitlist_id_seq" OWNED BY public."Waitlist".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: irontrackuser
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


ALTER TABLE public._prisma_migrations OWNER TO irontrackuser;

--
-- Name: defaultWOD; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."defaultWOD" (
    id integer NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    description text NOT NULL
);


ALTER TABLE public."defaultWOD" OWNER TO irontrackuser;

--
-- Name: defaultWOD_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."defaultWOD_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."defaultWOD_id_seq" OWNER TO irontrackuser;

--
-- Name: defaultWOD_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."defaultWOD_id_seq" OWNED BY public."defaultWOD".id;


--
-- Name: paymentMetadata; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."paymentMetadata" (
    id integer NOT NULL,
    "transactionId" integer NOT NULL,
    "montonioUuid" text NOT NULL,
    "contractId" integer NOT NULL,
    "affiliateId" integer NOT NULL,
    "isPaymentHoliday" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."paymentMetadata" OWNER TO irontrackuser;

--
-- Name: paymentMetadata_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."paymentMetadata_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."paymentMetadata_id_seq" OWNER TO irontrackuser;

--
-- Name: paymentMetadata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."paymentMetadata_id_seq" OWNED BY public."paymentMetadata".id;


--
-- Name: todayWOD; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public."todayWOD" (
    id integer NOT NULL,
    "wodName" text,
    type text NOT NULL,
    description text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "affiliateId" integer NOT NULL
);


ALTER TABLE public."todayWOD" OWNER TO irontrackuser;

--
-- Name: todayWOD_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public."todayWOD_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."todayWOD_id_seq" OWNER TO irontrackuser;

--
-- Name: todayWOD_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public."todayWOD_id_seq" OWNED BY public."todayWOD".id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: irontrackuser
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    amount double precision NOT NULL,
    "invoiceNumber" text NOT NULL,
    description text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text,
    type text,
    "affiliateId" integer NOT NULL,
    "planId" integer,
    "creditId" integer,
    "contractId" integer,
    "isCredit" boolean DEFAULT false,
    decrease boolean DEFAULT true NOT NULL,
    "memberId" integer
);


ALTER TABLE public.transactions OWNER TO irontrackuser;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: irontrackuser
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO irontrackuser;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: irontrackuser
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: Affiliate id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Affiliate" ALTER COLUMN id SET DEFAULT nextval('public."Affiliate_id_seq"'::regclass);


--
-- Name: AffiliateApiKeys id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."AffiliateApiKeys" ALTER COLUMN id SET DEFAULT nextval('public."AffiliateApiKeys_id_seq"'::regclass);


--
-- Name: AffiliateTrainer id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."AffiliateTrainer" ALTER COLUMN id SET DEFAULT nextval('public."AffiliateTrainer_id_seq"'::regclass);


--
-- Name: ClassAttendee id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ClassAttendee" ALTER COLUMN id SET DEFAULT nextval('public."ClassAttendee_id_seq"'::regclass);


--
-- Name: ClassLeaderboard id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ClassLeaderboard" ALTER COLUMN id SET DEFAULT nextval('public."ClassLeaderboard_id_seq"'::regclass);


--
-- Name: ClassSchedule id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ClassSchedule" ALTER COLUMN id SET DEFAULT nextval('public."ClassSchedule_id_seq"'::regclass);


--
-- Name: Contract id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Contract" ALTER COLUMN id SET DEFAULT nextval('public."Contract_id_seq"'::regclass);


--
-- Name: ContractLogs id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ContractLogs" ALTER COLUMN id SET DEFAULT nextval('public."ContractLogs_id_seq"'::regclass);


--
-- Name: ContractTerms id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ContractTerms" ALTER COLUMN id SET DEFAULT nextval('public."ContractTerms_id_seq"'::regclass);


--
-- Name: Credit id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Credit" ALTER COLUMN id SET DEFAULT nextval('public."Credit_id_seq"'::regclass);


--
-- Name: Exercise id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Exercise" ALTER COLUMN id SET DEFAULT nextval('public."Exercise_id_seq"'::regclass);


--
-- Name: Members id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Members" ALTER COLUMN id SET DEFAULT nextval('public."Members_id_seq"'::regclass);


--
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- Name: MessageGroup id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."MessageGroup" ALTER COLUMN id SET DEFAULT nextval('public."MessageGroup_id_seq"'::regclass);


--
-- Name: PaymentHoliday id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."PaymentHoliday" ALTER COLUMN id SET DEFAULT nextval('public."PaymentHoliday_id_seq"'::regclass);


--
-- Name: Plan id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Plan" ALTER COLUMN id SET DEFAULT nextval('public."Plan_id_seq"'::regclass);


--
-- Name: Record id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Record" ALTER COLUMN id SET DEFAULT nextval('public."Record_id_seq"'::regclass);


--
-- Name: SectorComment id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."SectorComment" ALTER COLUMN id SET DEFAULT nextval('public."SectorComment_id_seq"'::regclass);


--
-- Name: SectorYoutubeLink id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."SectorYoutubeLink" ALTER COLUMN id SET DEFAULT nextval('public."SectorYoutubeLink_id_seq"'::regclass);


--
-- Name: SignedContract id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."SignedContract" ALTER COLUMN id SET DEFAULT nextval('public."SignedContract_id_seq"'::regclass);


--
-- Name: Training id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Training" ALTER COLUMN id SET DEFAULT nextval('public."Training_id_seq"'::regclass);


--
-- Name: TrainingDay id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."TrainingDay" ALTER COLUMN id SET DEFAULT nextval('public."TrainingDay_id_seq"'::regclass);


--
-- Name: TrainingPlan id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."TrainingPlan" ALTER COLUMN id SET DEFAULT nextval('public."TrainingPlan_id_seq"'::regclass);


--
-- Name: TrainingSector id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."TrainingSector" ALTER COLUMN id SET DEFAULT nextval('public."TrainingSector_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: UserMessageGroup id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."UserMessageGroup" ALTER COLUMN id SET DEFAULT nextval('public."UserMessageGroup_id_seq"'::regclass);


--
-- Name: UserNote id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."UserNote" ALTER COLUMN id SET DEFAULT nextval('public."UserNote_id_seq"'::regclass);


--
-- Name: UserPlan id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."UserPlan" ALTER COLUMN id SET DEFAULT nextval('public."UserPlan_id_seq"'::regclass);


--
-- Name: Waitlist id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Waitlist" ALTER COLUMN id SET DEFAULT nextval('public."Waitlist_id_seq"'::regclass);


--
-- Name: defaultWOD id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."defaultWOD" ALTER COLUMN id SET DEFAULT nextval('public."defaultWOD_id_seq"'::regclass);


--
-- Name: paymentMetadata id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."paymentMetadata" ALTER COLUMN id SET DEFAULT nextval('public."paymentMetadata_id_seq"'::regclass);


--
-- Name: todayWOD id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."todayWOD" ALTER COLUMN id SET DEFAULT nextval('public."todayWOD_id_seq"'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Data for Name: Affiliate; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."Affiliate" (id, name, address, "trainingType", email, phone, iban, "bankName", "ownerId", logo, "paymentHolidayFee", subdomain) FROM stdin;
2	Crossfit Tartu	Tartu, aardla	CROSSFIT	prii.sander@gmail.com	5332864745	\N	\N	2	data:image/png;base64,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	15	crossfittartu
1	Crossfit Viljandi	Viljandi	CROSSFIT	a@a.a	56565656	\N	\N	1	data:image/png;base64,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	10	crossfitviljandi
\.


--
-- Data for Name: AffiliateApiKeys; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."AffiliateApiKeys" (id, "affiliateId", "accessKey", "secretKey") FROM stdin;
1	1	26268941-938c-4a62-a17a-58f407f070b9	KvXci3X93Tb9r1K/PlQkHhSAQ3b5ZzisYG3n4yu7bASq
2	2	26268941-938c-4a62-a17a-58f407f070b9	KvXci3X93Tb9r1K/PlQkHhSAQ3b5ZzisYG3n4yu7bASq
\.


--
-- Data for Name: AffiliateTrainer; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."AffiliateTrainer" (id, "affiliateId", "trainerId") FROM stdin;
3	2	5
4	1	5
\.


--
-- Data for Name: ClassAttendee; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."ClassAttendee" (id, "classId", "userId", "userPlanId", "createdAt", "checkIn", "affiliateId") FROM stdin;
1	2174	3	1	2025-03-22 18:29:34.698	t	2
\.


--
-- Data for Name: ClassLeaderboard; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."ClassLeaderboard" (id, "classId", "userId", "scoreType", score, "createdAt") FROM stdin;
\.


--
-- Data for Name: ClassSchedule; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."ClassSchedule" (id, "trainingType", "trainingName", "time", duration, trainer, "memberCapacity", location, "repeatWeekly", "ownerId", "affiliateId", "seriesId", "wodName", "wodType", description, "canRegister", "freeClass") FROM stdin;
1	WOD	CROSSFIT	2025-03-24 10:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
2	WOD	CROSSFIT	2025-03-31 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
3	WOD	CROSSFIT	2025-04-07 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
4	WOD	CROSSFIT	2025-04-14 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
5	WOD	CROSSFIT	2025-04-21 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
6	WOD	CROSSFIT	2025-04-28 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
7	WOD	CROSSFIT	2025-05-05 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
8	WOD	CROSSFIT	2025-05-12 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
9	WOD	CROSSFIT	2025-05-19 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
10	WOD	CROSSFIT	2025-05-26 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
11	WOD	CROSSFIT	2025-06-02 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
12	WOD	CROSSFIT	2025-06-09 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
13	WOD	CROSSFIT	2025-06-16 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
14	WOD	CROSSFIT	2025-06-23 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
15	WOD	CROSSFIT	2025-06-30 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
16	WOD	CROSSFIT	2025-07-07 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
17	WOD	CROSSFIT	2025-07-14 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
18	WOD	CROSSFIT	2025-07-21 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
19	WOD	CROSSFIT	2025-07-28 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
20	WOD	CROSSFIT	2025-08-04 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
21	WOD	CROSSFIT	2025-08-11 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
22	WOD	CROSSFIT	2025-08-18 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
23	WOD	CROSSFIT	2025-08-25 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
24	WOD	CROSSFIT	2025-09-01 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
25	WOD	CROSSFIT	2025-09-08 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
26	WOD	CROSSFIT	2025-09-15 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
27	WOD	CROSSFIT	2025-09-22 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
28	WOD	CROSSFIT	2025-09-29 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
29	WOD	CROSSFIT	2025-10-06 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
30	WOD	CROSSFIT	2025-10-13 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
31	WOD	CROSSFIT	2025-10-20 09:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
32	WOD	CROSSFIT	2025-10-27 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
33	WOD	CROSSFIT	2025-11-03 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
34	WOD	CROSSFIT	2025-11-10 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
35	WOD	CROSSFIT	2025-11-17 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
36	WOD	CROSSFIT	2025-11-24 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
37	WOD	CROSSFIT	2025-12-01 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
38	WOD	CROSSFIT	2025-12-08 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
39	WOD	CROSSFIT	2025-12-15 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
40	WOD	CROSSFIT	2025-12-22 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
41	WOD	CROSSFIT	2025-12-29 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
42	WOD	CROSSFIT	2026-01-05 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
43	WOD	CROSSFIT	2026-01-12 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
44	WOD	CROSSFIT	2026-01-19 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
45	WOD	CROSSFIT	2026-01-26 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
46	WOD	CROSSFIT	2026-02-02 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
47	WOD	CROSSFIT	2026-02-09 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
48	WOD	CROSSFIT	2026-02-16 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
49	WOD	CROSSFIT	2026-02-23 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
50	WOD	CROSSFIT	2026-03-02 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
51	WOD	CROSSFIT	2026-03-09 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
52	WOD	CROSSFIT	2026-03-16 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
53	WOD	CROSSFIT	2026-03-23 10:00:00	60	Treener	14	CFV	t	1	1	1	\N	\N	\N	t	f
54	WOD	CROSSFIT	2025-03-24 14:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
55	WOD	CROSSFIT	2025-03-31 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
56	WOD	CROSSFIT	2025-04-07 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
57	WOD	CROSSFIT	2025-04-14 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
58	WOD	CROSSFIT	2025-04-21 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
59	WOD	CROSSFIT	2025-04-28 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
60	WOD	CROSSFIT	2025-05-05 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
61	WOD	CROSSFIT	2025-05-12 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
62	WOD	CROSSFIT	2025-05-19 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
63	WOD	CROSSFIT	2025-05-26 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
64	WOD	CROSSFIT	2025-06-02 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
65	WOD	CROSSFIT	2025-06-09 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
66	WOD	CROSSFIT	2025-06-16 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
67	WOD	CROSSFIT	2025-06-23 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
68	WOD	CROSSFIT	2025-06-30 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
69	WOD	CROSSFIT	2025-07-07 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
70	WOD	CROSSFIT	2025-07-14 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
71	WOD	CROSSFIT	2025-07-21 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
72	WOD	CROSSFIT	2025-07-28 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
73	WOD	CROSSFIT	2025-08-04 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
74	WOD	CROSSFIT	2025-08-11 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
75	WOD	CROSSFIT	2025-08-18 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
76	WOD	CROSSFIT	2025-08-25 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
77	WOD	CROSSFIT	2025-09-01 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
78	WOD	CROSSFIT	2025-09-08 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
79	WOD	CROSSFIT	2025-09-15 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
80	WOD	CROSSFIT	2025-09-22 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
81	WOD	CROSSFIT	2025-09-29 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
82	WOD	CROSSFIT	2025-10-06 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
83	WOD	CROSSFIT	2025-10-13 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
84	WOD	CROSSFIT	2025-10-20 13:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
85	WOD	CROSSFIT	2025-10-27 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
86	WOD	CROSSFIT	2025-11-03 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
87	WOD	CROSSFIT	2025-11-10 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
88	WOD	CROSSFIT	2025-11-17 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
89	WOD	CROSSFIT	2025-11-24 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
90	WOD	CROSSFIT	2025-12-01 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
91	WOD	CROSSFIT	2025-12-08 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
92	WOD	CROSSFIT	2025-12-15 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
93	WOD	CROSSFIT	2025-12-22 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
94	WOD	CROSSFIT	2025-12-29 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
95	WOD	CROSSFIT	2026-01-05 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
96	WOD	CROSSFIT	2026-01-12 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
97	WOD	CROSSFIT	2026-01-19 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
98	WOD	CROSSFIT	2026-01-26 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
99	WOD	CROSSFIT	2026-02-02 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
100	WOD	CROSSFIT	2026-02-09 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
101	WOD	CROSSFIT	2026-02-16 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
102	WOD	CROSSFIT	2026-02-23 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
103	WOD	CROSSFIT	2026-03-02 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
104	WOD	CROSSFIT	2026-03-09 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
105	WOD	CROSSFIT	2026-03-16 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
106	WOD	CROSSFIT	2026-03-23 14:00:00	60	Treener	14	CFV	t	1	1	54	\N	\N	\N	t	f
107	WOD	CROSSFIT	2025-03-24 15:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
108	WOD	CROSSFIT	2025-03-31 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
109	WOD	CROSSFIT	2025-04-07 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
110	WOD	CROSSFIT	2025-04-14 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
111	WOD	CROSSFIT	2025-04-21 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
112	WOD	CROSSFIT	2025-04-28 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
113	WOD	CROSSFIT	2025-05-05 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
114	WOD	CROSSFIT	2025-05-12 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
115	WOD	CROSSFIT	2025-05-19 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
116	WOD	CROSSFIT	2025-05-26 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
117	WOD	CROSSFIT	2025-06-02 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
118	WOD	CROSSFIT	2025-06-09 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
119	WOD	CROSSFIT	2025-06-16 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
120	WOD	CROSSFIT	2025-06-23 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
121	WOD	CROSSFIT	2025-06-30 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
122	WOD	CROSSFIT	2025-07-07 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
123	WOD	CROSSFIT	2025-07-14 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
124	WOD	CROSSFIT	2025-07-21 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
125	WOD	CROSSFIT	2025-07-28 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
126	WOD	CROSSFIT	2025-08-04 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
127	WOD	CROSSFIT	2025-08-11 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
128	WOD	CROSSFIT	2025-08-18 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
129	WOD	CROSSFIT	2025-08-25 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
130	WOD	CROSSFIT	2025-09-01 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
131	WOD	CROSSFIT	2025-09-08 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
132	WOD	CROSSFIT	2025-09-15 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
133	WOD	CROSSFIT	2025-09-22 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
134	WOD	CROSSFIT	2025-09-29 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
135	WOD	CROSSFIT	2025-10-06 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
136	WOD	CROSSFIT	2025-10-13 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
137	WOD	CROSSFIT	2025-10-20 14:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
138	WOD	CROSSFIT	2025-10-27 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
139	WOD	CROSSFIT	2025-11-03 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
140	WOD	CROSSFIT	2025-11-10 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
141	WOD	CROSSFIT	2025-11-17 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
142	WOD	CROSSFIT	2025-11-24 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
143	WOD	CROSSFIT	2025-12-01 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
144	WOD	CROSSFIT	2025-12-08 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
145	WOD	CROSSFIT	2025-12-15 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
146	WOD	CROSSFIT	2025-12-22 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
147	WOD	CROSSFIT	2025-12-29 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
148	WOD	CROSSFIT	2026-01-05 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
149	WOD	CROSSFIT	2026-01-12 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
150	WOD	CROSSFIT	2026-01-19 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
151	WOD	CROSSFIT	2026-01-26 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
152	WOD	CROSSFIT	2026-02-02 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
153	WOD	CROSSFIT	2026-02-09 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
154	WOD	CROSSFIT	2026-02-16 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
155	WOD	CROSSFIT	2026-02-23 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
156	WOD	CROSSFIT	2026-03-02 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
157	WOD	CROSSFIT	2026-03-09 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
158	WOD	CROSSFIT	2026-03-16 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
159	WOD	CROSSFIT	2026-03-23 15:00:00	60	Treener	14	CFV	t	1	1	107	\N	\N	\N	t	f
266	Other	OPEN GYM	2025-03-24 13:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
267	Other	OPEN GYM	2025-03-31 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
268	Other	OPEN GYM	2025-04-07 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
269	Other	OPEN GYM	2025-04-14 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
270	Other	OPEN GYM	2025-04-21 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
271	Other	OPEN GYM	2025-04-28 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
272	Other	OPEN GYM	2025-05-05 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
273	Other	OPEN GYM	2025-05-12 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
274	Other	OPEN GYM	2025-05-19 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
275	Other	OPEN GYM	2025-05-26 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
276	Other	OPEN GYM	2025-06-02 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
277	Other	OPEN GYM	2025-06-09 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
278	Other	OPEN GYM	2025-06-16 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
279	Other	OPEN GYM	2025-06-23 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
280	Other	OPEN GYM	2025-06-30 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
281	Other	OPEN GYM	2025-07-07 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
282	Other	OPEN GYM	2025-07-14 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
283	Other	OPEN GYM	2025-07-21 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
284	Other	OPEN GYM	2025-07-28 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
285	Other	OPEN GYM	2025-08-04 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
286	Other	OPEN GYM	2025-08-11 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
287	Other	OPEN GYM	2025-08-18 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
288	Other	OPEN GYM	2025-08-25 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
289	Other	OPEN GYM	2025-09-01 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
290	Other	OPEN GYM	2025-09-08 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
291	Other	OPEN GYM	2025-09-15 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
292	Other	OPEN GYM	2025-09-22 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
293	Other	OPEN GYM	2025-09-29 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
294	Other	OPEN GYM	2025-10-06 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
295	Other	OPEN GYM	2025-10-13 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
296	Other	OPEN GYM	2025-10-20 12:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
297	Other	OPEN GYM	2025-10-27 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
298	Other	OPEN GYM	2025-11-03 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
299	Other	OPEN GYM	2025-11-10 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
300	Other	OPEN GYM	2025-11-17 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
301	Other	OPEN GYM	2025-11-24 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
302	Other	OPEN GYM	2025-12-01 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
303	Other	OPEN GYM	2025-12-08 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
304	Other	OPEN GYM	2025-12-15 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
305	Other	OPEN GYM	2025-12-22 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
306	Other	OPEN GYM	2025-12-29 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
307	Other	OPEN GYM	2026-01-05 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
308	Other	OPEN GYM	2026-01-12 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
309	Other	OPEN GYM	2026-01-19 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
310	Other	OPEN GYM	2026-01-26 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
311	Other	OPEN GYM	2026-02-02 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
312	Other	OPEN GYM	2026-02-09 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
313	Other	OPEN GYM	2026-02-16 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
314	Other	OPEN GYM	2026-02-23 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
315	Other	OPEN GYM	2026-03-02 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
316	Other	OPEN GYM	2026-03-09 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
317	Other	OPEN GYM	2026-03-16 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
318	Other	OPEN GYM	2026-03-23 13:00:00	120	Treener	10	CFV	t	1	1	266	\N	\N	\N	t	f
1432	WOD	CROSSFIT	2025-03-25 12:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
1433	WOD	CROSSFIT	2025-04-01 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1434	WOD	CROSSFIT	2025-04-08 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1435	WOD	CROSSFIT	2025-04-15 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1436	WOD	CROSSFIT	2025-04-22 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1437	WOD	CROSSFIT	2025-04-29 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1438	WOD	CROSSFIT	2025-05-06 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1439	WOD	CROSSFIT	2025-05-13 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1440	WOD	CROSSFIT	2025-05-20 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1441	WOD	CROSSFIT	2025-05-27 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1442	WOD	CROSSFIT	2025-06-03 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1443	WOD	CROSSFIT	2025-06-10 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1444	WOD	CROSSFIT	2025-06-17 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
160	WOD	CROSSFIT	2025-03-24 16:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
161	WOD	CROSSFIT	2025-03-31 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
162	WOD	CROSSFIT	2025-04-07 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
163	WOD	CROSSFIT	2025-04-14 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
164	WOD	CROSSFIT	2025-04-21 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
165	WOD	CROSSFIT	2025-04-28 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
166	WOD	CROSSFIT	2025-05-05 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
167	WOD	CROSSFIT	2025-05-12 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
168	WOD	CROSSFIT	2025-05-19 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
169	WOD	CROSSFIT	2025-05-26 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
170	WOD	CROSSFIT	2025-06-02 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
171	WOD	CROSSFIT	2025-06-09 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
172	WOD	CROSSFIT	2025-06-16 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
173	WOD	CROSSFIT	2025-06-23 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
174	WOD	CROSSFIT	2025-06-30 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
175	WOD	CROSSFIT	2025-07-07 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
176	WOD	CROSSFIT	2025-07-14 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
177	WOD	CROSSFIT	2025-07-21 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
178	WOD	CROSSFIT	2025-07-28 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
179	WOD	CROSSFIT	2025-08-04 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
180	WOD	CROSSFIT	2025-08-11 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
181	WOD	CROSSFIT	2025-08-18 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
182	WOD	CROSSFIT	2025-08-25 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
183	WOD	CROSSFIT	2025-09-01 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
184	WOD	CROSSFIT	2025-09-08 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
185	WOD	CROSSFIT	2025-09-15 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
186	WOD	CROSSFIT	2025-09-22 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
187	WOD	CROSSFIT	2025-09-29 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
188	WOD	CROSSFIT	2025-10-06 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
189	WOD	CROSSFIT	2025-10-13 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
190	WOD	CROSSFIT	2025-10-20 15:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
191	WOD	CROSSFIT	2025-10-27 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
192	WOD	CROSSFIT	2025-11-03 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
193	WOD	CROSSFIT	2025-11-10 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
194	WOD	CROSSFIT	2025-11-17 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
195	WOD	CROSSFIT	2025-11-24 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
196	WOD	CROSSFIT	2025-12-01 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
197	WOD	CROSSFIT	2025-12-08 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
198	WOD	CROSSFIT	2025-12-15 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
199	WOD	CROSSFIT	2025-12-22 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
200	WOD	CROSSFIT	2025-12-29 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
201	WOD	CROSSFIT	2026-01-05 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
202	WOD	CROSSFIT	2026-01-12 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
203	WOD	CROSSFIT	2026-01-19 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
204	WOD	CROSSFIT	2026-01-26 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
205	WOD	CROSSFIT	2026-02-02 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
206	WOD	CROSSFIT	2026-02-09 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
207	WOD	CROSSFIT	2026-02-16 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
208	WOD	CROSSFIT	2026-02-23 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
209	WOD	CROSSFIT	2026-03-02 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
210	WOD	CROSSFIT	2026-03-09 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
211	WOD	CROSSFIT	2026-03-16 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
212	WOD	CROSSFIT	2026-03-23 16:00:00	60	Treener	14	CFV	t	1	1	160	\N	\N	\N	t	f
213	Other	OPEN GYM	2025-03-24 10:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
214	Other	OPEN GYM	2025-03-31 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
215	Other	OPEN GYM	2025-04-07 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
216	Other	OPEN GYM	2025-04-14 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
217	Other	OPEN GYM	2025-04-21 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
218	Other	OPEN GYM	2025-04-28 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
219	Other	OPEN GYM	2025-05-05 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
220	Other	OPEN GYM	2025-05-12 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
221	Other	OPEN GYM	2025-05-19 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
222	Other	OPEN GYM	2025-05-26 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
223	Other	OPEN GYM	2025-06-02 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
224	Other	OPEN GYM	2025-06-09 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
225	Other	OPEN GYM	2025-06-16 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
226	Other	OPEN GYM	2025-06-23 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
227	Other	OPEN GYM	2025-06-30 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
228	Other	OPEN GYM	2025-07-07 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
229	Other	OPEN GYM	2025-07-14 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
230	Other	OPEN GYM	2025-07-21 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
231	Other	OPEN GYM	2025-07-28 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
232	Other	OPEN GYM	2025-08-04 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
233	Other	OPEN GYM	2025-08-11 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
234	Other	OPEN GYM	2025-08-18 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
235	Other	OPEN GYM	2025-08-25 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
236	Other	OPEN GYM	2025-09-01 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
237	Other	OPEN GYM	2025-09-08 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
238	Other	OPEN GYM	2025-09-15 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
239	Other	OPEN GYM	2025-09-22 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
240	Other	OPEN GYM	2025-09-29 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
241	Other	OPEN GYM	2025-10-06 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
242	Other	OPEN GYM	2025-10-13 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
243	Other	OPEN GYM	2025-10-20 09:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
244	Other	OPEN GYM	2025-10-27 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
245	Other	OPEN GYM	2025-11-03 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
246	Other	OPEN GYM	2025-11-10 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
247	Other	OPEN GYM	2025-11-17 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
248	Other	OPEN GYM	2025-11-24 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
249	Other	OPEN GYM	2025-12-01 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
250	Other	OPEN GYM	2025-12-08 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
251	Other	OPEN GYM	2025-12-15 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
252	Other	OPEN GYM	2025-12-22 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
253	Other	OPEN GYM	2025-12-29 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
254	Other	OPEN GYM	2026-01-05 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
255	Other	OPEN GYM	2026-01-12 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
256	Other	OPEN GYM	2026-01-19 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
257	Other	OPEN GYM	2026-01-26 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
258	Other	OPEN GYM	2026-02-02 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
259	Other	OPEN GYM	2026-02-09 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
260	Other	OPEN GYM	2026-02-16 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
261	Other	OPEN GYM	2026-02-23 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
262	Other	OPEN GYM	2026-03-02 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
263	Other	OPEN GYM	2026-03-09 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
264	Other	OPEN GYM	2026-03-16 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
265	Other	OPEN GYM	2026-03-23 10:00:00	120	Treener	10	CFV	t	1	1	213	\N	\N	\N	t	f
319	Other	OPEN GYM	2025-03-24 15:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
320	Other	OPEN GYM	2025-03-31 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
321	Other	OPEN GYM	2025-04-07 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
322	Other	OPEN GYM	2025-04-14 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
323	Other	OPEN GYM	2025-04-21 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
324	Other	OPEN GYM	2025-04-28 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
325	Other	OPEN GYM	2025-05-05 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
326	Other	OPEN GYM	2025-05-12 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
327	Other	OPEN GYM	2025-05-19 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
328	Other	OPEN GYM	2025-05-26 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
329	Other	OPEN GYM	2025-06-02 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
330	Other	OPEN GYM	2025-06-09 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
331	Other	OPEN GYM	2025-06-16 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
332	Other	OPEN GYM	2025-06-23 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
333	Other	OPEN GYM	2025-06-30 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
334	Other	OPEN GYM	2025-07-07 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
335	Other	OPEN GYM	2025-07-14 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
336	Other	OPEN GYM	2025-07-21 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
337	Other	OPEN GYM	2025-07-28 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
338	Other	OPEN GYM	2025-08-04 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
339	Other	OPEN GYM	2025-08-11 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
340	Other	OPEN GYM	2025-08-18 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
341	Other	OPEN GYM	2025-08-25 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
342	Other	OPEN GYM	2025-09-01 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
343	Other	OPEN GYM	2025-09-08 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
344	Other	OPEN GYM	2025-09-15 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
345	Other	OPEN GYM	2025-09-22 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
346	Other	OPEN GYM	2025-09-29 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
347	Other	OPEN GYM	2025-10-06 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
348	Other	OPEN GYM	2025-10-13 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
349	Other	OPEN GYM	2025-10-20 14:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
350	Other	OPEN GYM	2025-10-27 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
351	Other	OPEN GYM	2025-11-03 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
352	Other	OPEN GYM	2025-11-10 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
353	Other	OPEN GYM	2025-11-17 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
354	Other	OPEN GYM	2025-11-24 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
355	Other	OPEN GYM	2025-12-01 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
356	Other	OPEN GYM	2025-12-08 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
357	Other	OPEN GYM	2025-12-15 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
358	Other	OPEN GYM	2025-12-22 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
359	Other	OPEN GYM	2025-12-29 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
360	Other	OPEN GYM	2026-01-05 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
361	Other	OPEN GYM	2026-01-12 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
362	Other	OPEN GYM	2026-01-19 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
363	Other	OPEN GYM	2026-01-26 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
364	Other	OPEN GYM	2026-02-02 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
365	Other	OPEN GYM	2026-02-09 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
366	Other	OPEN GYM	2026-02-16 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
367	Other	OPEN GYM	2026-02-23 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
368	Other	OPEN GYM	2026-03-02 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
369	Other	OPEN GYM	2026-03-09 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
370	Other	OPEN GYM	2026-03-16 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
371	Other	OPEN GYM	2026-03-23 15:00:00	120	Treener	10	CFV	t	1	1	319	\N	\N	\N	t	f
372	Other	OPEN GYM	2025-03-25 15:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
373	Other	OPEN GYM	2025-04-01 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
374	Other	OPEN GYM	2025-04-08 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
375	Other	OPEN GYM	2025-04-15 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
376	Other	OPEN GYM	2025-04-22 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
377	Other	OPEN GYM	2025-04-29 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
378	Other	OPEN GYM	2025-05-06 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
379	Other	OPEN GYM	2025-05-13 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
380	Other	OPEN GYM	2025-05-20 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
381	Other	OPEN GYM	2025-05-27 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
382	Other	OPEN GYM	2025-06-03 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
383	Other	OPEN GYM	2025-06-10 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
384	Other	OPEN GYM	2025-06-17 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
385	Other	OPEN GYM	2025-06-24 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
386	Other	OPEN GYM	2025-07-01 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
387	Other	OPEN GYM	2025-07-08 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
388	Other	OPEN GYM	2025-07-15 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
389	Other	OPEN GYM	2025-07-22 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
390	Other	OPEN GYM	2025-07-29 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
391	Other	OPEN GYM	2025-08-05 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
392	Other	OPEN GYM	2025-08-12 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
393	Other	OPEN GYM	2025-08-19 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
394	Other	OPEN GYM	2025-08-26 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
395	Other	OPEN GYM	2025-09-02 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
396	Other	OPEN GYM	2025-09-09 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
397	Other	OPEN GYM	2025-09-16 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
398	Other	OPEN GYM	2025-09-23 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
399	Other	OPEN GYM	2025-09-30 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
400	Other	OPEN GYM	2025-10-07 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
401	Other	OPEN GYM	2025-10-14 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
402	Other	OPEN GYM	2025-10-21 14:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
403	Other	OPEN GYM	2025-10-28 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
404	Other	OPEN GYM	2025-11-04 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
405	Other	OPEN GYM	2025-11-11 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
406	Other	OPEN GYM	2025-11-18 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
407	Other	OPEN GYM	2025-11-25 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
408	Other	OPEN GYM	2025-12-02 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
409	Other	OPEN GYM	2025-12-09 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
410	Other	OPEN GYM	2025-12-16 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
411	Other	OPEN GYM	2025-12-23 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
412	Other	OPEN GYM	2025-12-30 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
413	Other	OPEN GYM	2026-01-06 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
414	Other	OPEN GYM	2026-01-13 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
415	Other	OPEN GYM	2026-01-20 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
416	Other	OPEN GYM	2026-01-27 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
417	Other	OPEN GYM	2026-02-03 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
418	Other	OPEN GYM	2026-02-10 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
419	Other	OPEN GYM	2026-02-17 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
420	Other	OPEN GYM	2026-02-24 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
421	Other	OPEN GYM	2026-03-03 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
422	Other	OPEN GYM	2026-03-10 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
423	Other	OPEN GYM	2026-03-17 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
424	Other	OPEN GYM	2026-03-24 15:00:00	120	Treener	10	CFV	t	1	1	372	\N	\N	\N	t	f
425	Other	OPEN GYM	2025-03-25 13:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
426	Other	OPEN GYM	2025-04-01 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
427	Other	OPEN GYM	2025-04-08 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
428	Other	OPEN GYM	2025-04-15 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
429	Other	OPEN GYM	2025-04-22 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
430	Other	OPEN GYM	2025-04-29 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
431	Other	OPEN GYM	2025-05-06 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
432	Other	OPEN GYM	2025-05-13 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
433	Other	OPEN GYM	2025-05-20 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
434	Other	OPEN GYM	2025-05-27 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
435	Other	OPEN GYM	2025-06-03 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
436	Other	OPEN GYM	2025-06-10 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
437	Other	OPEN GYM	2025-06-17 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
438	Other	OPEN GYM	2025-06-24 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
439	Other	OPEN GYM	2025-07-01 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
440	Other	OPEN GYM	2025-07-08 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
441	Other	OPEN GYM	2025-07-15 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
442	Other	OPEN GYM	2025-07-22 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
443	Other	OPEN GYM	2025-07-29 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
444	Other	OPEN GYM	2025-08-05 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
445	Other	OPEN GYM	2025-08-12 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
446	Other	OPEN GYM	2025-08-19 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
447	Other	OPEN GYM	2025-08-26 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
448	Other	OPEN GYM	2025-09-02 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
449	Other	OPEN GYM	2025-09-09 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
450	Other	OPEN GYM	2025-09-16 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
451	Other	OPEN GYM	2025-09-23 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
452	Other	OPEN GYM	2025-09-30 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
453	Other	OPEN GYM	2025-10-07 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
454	Other	OPEN GYM	2025-10-14 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
455	Other	OPEN GYM	2025-10-21 12:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
456	Other	OPEN GYM	2025-10-28 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
457	Other	OPEN GYM	2025-11-04 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
458	Other	OPEN GYM	2025-11-11 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
459	Other	OPEN GYM	2025-11-18 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
460	Other	OPEN GYM	2025-11-25 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
461	Other	OPEN GYM	2025-12-02 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
462	Other	OPEN GYM	2025-12-09 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
463	Other	OPEN GYM	2025-12-16 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
464	Other	OPEN GYM	2025-12-23 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
465	Other	OPEN GYM	2025-12-30 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
466	Other	OPEN GYM	2026-01-06 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
467	Other	OPEN GYM	2026-01-13 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
468	Other	OPEN GYM	2026-01-20 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
469	Other	OPEN GYM	2026-01-27 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
470	Other	OPEN GYM	2026-02-03 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
471	Other	OPEN GYM	2026-02-10 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
472	Other	OPEN GYM	2026-02-17 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
473	Other	OPEN GYM	2026-02-24 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
474	Other	OPEN GYM	2026-03-03 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
475	Other	OPEN GYM	2026-03-10 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
476	Other	OPEN GYM	2026-03-17 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
477	Other	OPEN GYM	2026-03-24 13:00:00	120	Treener	10	CFV	t	1	1	425	\N	\N	\N	t	f
478	Other	OPEN GYM	2025-03-25 10:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
479	Other	OPEN GYM	2025-04-01 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
480	Other	OPEN GYM	2025-04-08 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
481	Other	OPEN GYM	2025-04-15 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
482	Other	OPEN GYM	2025-04-22 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
483	Other	OPEN GYM	2025-04-29 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
484	Other	OPEN GYM	2025-05-06 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
485	Other	OPEN GYM	2025-05-13 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
486	Other	OPEN GYM	2025-05-20 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
487	Other	OPEN GYM	2025-05-27 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
488	Other	OPEN GYM	2025-06-03 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
489	Other	OPEN GYM	2025-06-10 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
490	Other	OPEN GYM	2025-06-17 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
491	Other	OPEN GYM	2025-06-24 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
492	Other	OPEN GYM	2025-07-01 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
493	Other	OPEN GYM	2025-07-08 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
494	Other	OPEN GYM	2025-07-15 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
495	Other	OPEN GYM	2025-07-22 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
496	Other	OPEN GYM	2025-07-29 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
497	Other	OPEN GYM	2025-08-05 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
498	Other	OPEN GYM	2025-08-12 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
499	Other	OPEN GYM	2025-08-19 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
500	Other	OPEN GYM	2025-08-26 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
501	Other	OPEN GYM	2025-09-02 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
502	Other	OPEN GYM	2025-09-09 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
503	Other	OPEN GYM	2025-09-16 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
504	Other	OPEN GYM	2025-09-23 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
505	Other	OPEN GYM	2025-09-30 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
506	Other	OPEN GYM	2025-10-07 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
507	Other	OPEN GYM	2025-10-14 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
508	Other	OPEN GYM	2025-10-21 09:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
509	Other	OPEN GYM	2025-10-28 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
510	Other	OPEN GYM	2025-11-04 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
511	Other	OPEN GYM	2025-11-11 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
512	Other	OPEN GYM	2025-11-18 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
513	Other	OPEN GYM	2025-11-25 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
514	Other	OPEN GYM	2025-12-02 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
515	Other	OPEN GYM	2025-12-09 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
516	Other	OPEN GYM	2025-12-16 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
517	Other	OPEN GYM	2025-12-23 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
518	Other	OPEN GYM	2025-12-30 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
519	Other	OPEN GYM	2026-01-06 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
520	Other	OPEN GYM	2026-01-13 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
521	Other	OPEN GYM	2026-01-20 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
522	Other	OPEN GYM	2026-01-27 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
523	Other	OPEN GYM	2026-02-03 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
524	Other	OPEN GYM	2026-02-10 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
525	Other	OPEN GYM	2026-02-17 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
526	Other	OPEN GYM	2026-02-24 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
527	Other	OPEN GYM	2026-03-03 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
528	Other	OPEN GYM	2026-03-10 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
529	Other	OPEN GYM	2026-03-17 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
530	Other	OPEN GYM	2026-03-24 10:00:00	120	Treener	10	CFV	t	1	1	478	\N	\N	\N	t	f
584	Other	OPEN GYM	2025-03-26 13:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
585	Other	OPEN GYM	2025-04-02 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
586	Other	OPEN GYM	2025-04-09 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
587	Other	OPEN GYM	2025-04-16 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
588	Other	OPEN GYM	2025-04-23 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
589	Other	OPEN GYM	2025-04-30 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
590	Other	OPEN GYM	2025-05-07 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
591	Other	OPEN GYM	2025-05-14 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
592	Other	OPEN GYM	2025-05-21 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
593	Other	OPEN GYM	2025-05-28 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
594	Other	OPEN GYM	2025-06-04 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
595	Other	OPEN GYM	2025-06-11 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
596	Other	OPEN GYM	2025-06-18 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
597	Other	OPEN GYM	2025-06-25 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
598	Other	OPEN GYM	2025-07-02 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
599	Other	OPEN GYM	2025-07-09 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
600	Other	OPEN GYM	2025-07-16 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
601	Other	OPEN GYM	2025-07-23 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
602	Other	OPEN GYM	2025-07-30 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
603	Other	OPEN GYM	2025-08-06 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
604	Other	OPEN GYM	2025-08-13 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
605	Other	OPEN GYM	2025-08-20 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
606	Other	OPEN GYM	2025-08-27 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
607	Other	OPEN GYM	2025-09-03 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
608	Other	OPEN GYM	2025-09-10 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
609	Other	OPEN GYM	2025-09-17 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
610	Other	OPEN GYM	2025-09-24 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
611	Other	OPEN GYM	2025-10-01 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
612	Other	OPEN GYM	2025-10-08 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
613	Other	OPEN GYM	2025-10-15 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
614	Other	OPEN GYM	2025-10-22 12:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
615	Other	OPEN GYM	2025-10-29 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
616	Other	OPEN GYM	2025-11-05 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
617	Other	OPEN GYM	2025-11-12 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
618	Other	OPEN GYM	2025-11-19 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
619	Other	OPEN GYM	2025-11-26 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
620	Other	OPEN GYM	2025-12-03 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
621	Other	OPEN GYM	2025-12-10 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
622	Other	OPEN GYM	2025-12-17 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
623	Other	OPEN GYM	2025-12-24 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
624	Other	OPEN GYM	2025-12-31 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
625	Other	OPEN GYM	2026-01-07 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
626	Other	OPEN GYM	2026-01-14 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
627	Other	OPEN GYM	2026-01-21 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
628	Other	OPEN GYM	2026-01-28 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
629	Other	OPEN GYM	2026-02-04 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
630	Other	OPEN GYM	2026-02-11 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
631	Other	OPEN GYM	2026-02-18 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
632	Other	OPEN GYM	2026-02-25 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
633	Other	OPEN GYM	2026-03-04 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
634	Other	OPEN GYM	2026-03-11 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
635	Other	OPEN GYM	2026-03-18 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
636	Other	OPEN GYM	2026-03-25 13:00:00	120	Treener	10	CFV	t	1	1	584	\N	\N	\N	t	f
690	Other	OPEN GYM	2025-03-27 10:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
691	Other	OPEN GYM	2025-04-03 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
692	Other	OPEN GYM	2025-04-10 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
693	Other	OPEN GYM	2025-04-17 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
531	Other	OPEN GYM	2025-03-26 10:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
532	Other	OPEN GYM	2025-04-02 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
533	Other	OPEN GYM	2025-04-09 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
534	Other	OPEN GYM	2025-04-16 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
535	Other	OPEN GYM	2025-04-23 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
536	Other	OPEN GYM	2025-04-30 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
537	Other	OPEN GYM	2025-05-07 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
538	Other	OPEN GYM	2025-05-14 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
539	Other	OPEN GYM	2025-05-21 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
540	Other	OPEN GYM	2025-05-28 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
541	Other	OPEN GYM	2025-06-04 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
542	Other	OPEN GYM	2025-06-11 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
543	Other	OPEN GYM	2025-06-18 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
544	Other	OPEN GYM	2025-06-25 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
545	Other	OPEN GYM	2025-07-02 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
546	Other	OPEN GYM	2025-07-09 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
547	Other	OPEN GYM	2025-07-16 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
548	Other	OPEN GYM	2025-07-23 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
549	Other	OPEN GYM	2025-07-30 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
550	Other	OPEN GYM	2025-08-06 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
551	Other	OPEN GYM	2025-08-13 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
552	Other	OPEN GYM	2025-08-20 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
553	Other	OPEN GYM	2025-08-27 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
554	Other	OPEN GYM	2025-09-03 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
555	Other	OPEN GYM	2025-09-10 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
556	Other	OPEN GYM	2025-09-17 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
557	Other	OPEN GYM	2025-09-24 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
558	Other	OPEN GYM	2025-10-01 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
559	Other	OPEN GYM	2025-10-08 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
560	Other	OPEN GYM	2025-10-15 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
561	Other	OPEN GYM	2025-10-22 09:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
562	Other	OPEN GYM	2025-10-29 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
563	Other	OPEN GYM	2025-11-05 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
564	Other	OPEN GYM	2025-11-12 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
565	Other	OPEN GYM	2025-11-19 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
566	Other	OPEN GYM	2025-11-26 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
567	Other	OPEN GYM	2025-12-03 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
568	Other	OPEN GYM	2025-12-10 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
569	Other	OPEN GYM	2025-12-17 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
570	Other	OPEN GYM	2025-12-24 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
571	Other	OPEN GYM	2025-12-31 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
572	Other	OPEN GYM	2026-01-07 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
573	Other	OPEN GYM	2026-01-14 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
574	Other	OPEN GYM	2026-01-21 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
575	Other	OPEN GYM	2026-01-28 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
576	Other	OPEN GYM	2026-02-04 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
577	Other	OPEN GYM	2026-02-11 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
578	Other	OPEN GYM	2026-02-18 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
579	Other	OPEN GYM	2026-02-25 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
580	Other	OPEN GYM	2026-03-04 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
581	Other	OPEN GYM	2026-03-11 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
582	Other	OPEN GYM	2026-03-18 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
583	Other	OPEN GYM	2026-03-25 10:00:00	120	Treener	10	CFV	t	1	1	531	\N	\N	\N	t	f
637	Other	OPEN GYM	2025-03-26 15:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
638	Other	OPEN GYM	2025-04-02 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
639	Other	OPEN GYM	2025-04-09 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
640	Other	OPEN GYM	2025-04-16 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
641	Other	OPEN GYM	2025-04-23 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
642	Other	OPEN GYM	2025-04-30 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
643	Other	OPEN GYM	2025-05-07 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
644	Other	OPEN GYM	2025-05-14 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
645	Other	OPEN GYM	2025-05-21 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
646	Other	OPEN GYM	2025-05-28 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
647	Other	OPEN GYM	2025-06-04 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
648	Other	OPEN GYM	2025-06-11 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
649	Other	OPEN GYM	2025-06-18 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
650	Other	OPEN GYM	2025-06-25 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
651	Other	OPEN GYM	2025-07-02 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
652	Other	OPEN GYM	2025-07-09 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
653	Other	OPEN GYM	2025-07-16 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
654	Other	OPEN GYM	2025-07-23 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
655	Other	OPEN GYM	2025-07-30 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
656	Other	OPEN GYM	2025-08-06 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
657	Other	OPEN GYM	2025-08-13 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
658	Other	OPEN GYM	2025-08-20 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
659	Other	OPEN GYM	2025-08-27 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
660	Other	OPEN GYM	2025-09-03 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
661	Other	OPEN GYM	2025-09-10 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
662	Other	OPEN GYM	2025-09-17 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
663	Other	OPEN GYM	2025-09-24 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
664	Other	OPEN GYM	2025-10-01 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
665	Other	OPEN GYM	2025-10-08 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
666	Other	OPEN GYM	2025-10-15 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
667	Other	OPEN GYM	2025-10-22 14:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
668	Other	OPEN GYM	2025-10-29 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
669	Other	OPEN GYM	2025-11-05 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
670	Other	OPEN GYM	2025-11-12 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
671	Other	OPEN GYM	2025-11-19 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
672	Other	OPEN GYM	2025-11-26 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
673	Other	OPEN GYM	2025-12-03 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
674	Other	OPEN GYM	2025-12-10 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
675	Other	OPEN GYM	2025-12-17 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
676	Other	OPEN GYM	2025-12-24 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
677	Other	OPEN GYM	2025-12-31 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
678	Other	OPEN GYM	2026-01-07 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
679	Other	OPEN GYM	2026-01-14 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
680	Other	OPEN GYM	2026-01-21 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
681	Other	OPEN GYM	2026-01-28 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
682	Other	OPEN GYM	2026-02-04 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
683	Other	OPEN GYM	2026-02-11 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
684	Other	OPEN GYM	2026-02-18 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
685	Other	OPEN GYM	2026-02-25 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
686	Other	OPEN GYM	2026-03-04 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
687	Other	OPEN GYM	2026-03-11 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
688	Other	OPEN GYM	2026-03-18 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
689	Other	OPEN GYM	2026-03-25 15:00:00	120	Treener	10	CFV	t	1	1	637	\N	\N	\N	t	f
1445	WOD	CROSSFIT	2025-06-24 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1446	WOD	CROSSFIT	2025-07-01 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1447	WOD	CROSSFIT	2025-07-08 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1448	WOD	CROSSFIT	2025-07-15 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1449	WOD	CROSSFIT	2025-07-22 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1450	WOD	CROSSFIT	2025-07-29 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1451	WOD	CROSSFIT	2025-08-05 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1452	WOD	CROSSFIT	2025-08-12 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1453	WOD	CROSSFIT	2025-08-19 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1454	WOD	CROSSFIT	2025-08-26 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1455	WOD	CROSSFIT	2025-09-02 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1456	WOD	CROSSFIT	2025-09-09 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1457	WOD	CROSSFIT	2025-09-16 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1458	WOD	CROSSFIT	2025-09-23 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1459	WOD	CROSSFIT	2025-09-30 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1460	WOD	CROSSFIT	2025-10-07 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1461	WOD	CROSSFIT	2025-10-14 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1462	WOD	CROSSFIT	2025-10-21 11:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1463	WOD	CROSSFIT	2025-10-28 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1464	WOD	CROSSFIT	2025-11-04 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1465	WOD	CROSSFIT	2025-11-11 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1466	WOD	CROSSFIT	2025-11-18 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1467	WOD	CROSSFIT	2025-11-25 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1468	WOD	CROSSFIT	2025-12-02 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1469	WOD	CROSSFIT	2025-12-09 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1470	WOD	CROSSFIT	2025-12-16 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1471	WOD	CROSSFIT	2025-12-23 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1472	WOD	CROSSFIT	2025-12-30 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1473	WOD	CROSSFIT	2026-01-06 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1474	WOD	CROSSFIT	2026-01-13 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1475	WOD	CROSSFIT	2026-01-20 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1476	WOD	CROSSFIT	2026-01-27 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1477	WOD	CROSSFIT	2026-02-03 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1478	WOD	CROSSFIT	2026-02-10 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1479	WOD	CROSSFIT	2026-02-17 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1480	WOD	CROSSFIT	2026-02-24 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1481	WOD	CROSSFIT	2026-03-03 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1482	WOD	CROSSFIT	2026-03-10 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1483	WOD	CROSSFIT	2026-03-17 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1484	WOD	CROSSFIT	2026-03-24 12:00:00	60	Treener	14	CFV	t	1	1	1432	\N	\N	\N	t	f
1628	WOD	CROSSFIT	2025-12-10 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1629	WOD	CROSSFIT	2025-12-17 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1630	WOD	CROSSFIT	2025-12-24 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1631	WOD	CROSSFIT	2025-12-31 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
694	Other	OPEN GYM	2025-04-24 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
695	Other	OPEN GYM	2025-05-01 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
696	Other	OPEN GYM	2025-05-08 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
697	Other	OPEN GYM	2025-05-15 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
698	Other	OPEN GYM	2025-05-22 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
699	Other	OPEN GYM	2025-05-29 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
700	Other	OPEN GYM	2025-06-05 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
701	Other	OPEN GYM	2025-06-12 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
702	Other	OPEN GYM	2025-06-19 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
703	Other	OPEN GYM	2025-06-26 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
704	Other	OPEN GYM	2025-07-03 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
705	Other	OPEN GYM	2025-07-10 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
706	Other	OPEN GYM	2025-07-17 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
707	Other	OPEN GYM	2025-07-24 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
708	Other	OPEN GYM	2025-07-31 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
709	Other	OPEN GYM	2025-08-07 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
710	Other	OPEN GYM	2025-08-14 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
711	Other	OPEN GYM	2025-08-21 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
712	Other	OPEN GYM	2025-08-28 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
713	Other	OPEN GYM	2025-09-04 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
714	Other	OPEN GYM	2025-09-11 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
715	Other	OPEN GYM	2025-09-18 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
716	Other	OPEN GYM	2025-09-25 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
717	Other	OPEN GYM	2025-10-02 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
718	Other	OPEN GYM	2025-10-09 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
719	Other	OPEN GYM	2025-10-16 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
720	Other	OPEN GYM	2025-10-23 09:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
721	Other	OPEN GYM	2025-10-30 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
722	Other	OPEN GYM	2025-11-06 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
723	Other	OPEN GYM	2025-11-13 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
724	Other	OPEN GYM	2025-11-20 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
725	Other	OPEN GYM	2025-11-27 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
726	Other	OPEN GYM	2025-12-04 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
727	Other	OPEN GYM	2025-12-11 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
728	Other	OPEN GYM	2025-12-18 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
729	Other	OPEN GYM	2025-12-25 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
730	Other	OPEN GYM	2026-01-01 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
731	Other	OPEN GYM	2026-01-08 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
732	Other	OPEN GYM	2026-01-15 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
733	Other	OPEN GYM	2026-01-22 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
734	Other	OPEN GYM	2026-01-29 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
735	Other	OPEN GYM	2026-02-05 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
736	Other	OPEN GYM	2026-02-12 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
737	Other	OPEN GYM	2026-02-19 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
738	Other	OPEN GYM	2026-02-26 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
739	Other	OPEN GYM	2026-03-05 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
740	Other	OPEN GYM	2026-03-12 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
741	Other	OPEN GYM	2026-03-19 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
742	Other	OPEN GYM	2026-03-26 10:00:00	120	Treener	10	CFV	t	1	1	690	\N	\N	\N	t	f
743	Other	OPEN GYM	2025-03-27 13:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
744	Other	OPEN GYM	2025-04-03 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
745	Other	OPEN GYM	2025-04-10 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
746	Other	OPEN GYM	2025-04-17 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
747	Other	OPEN GYM	2025-04-24 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
748	Other	OPEN GYM	2025-05-01 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
749	Other	OPEN GYM	2025-05-08 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
750	Other	OPEN GYM	2025-05-15 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
751	Other	OPEN GYM	2025-05-22 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
752	Other	OPEN GYM	2025-05-29 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
753	Other	OPEN GYM	2025-06-05 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
754	Other	OPEN GYM	2025-06-12 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
755	Other	OPEN GYM	2025-06-19 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
756	Other	OPEN GYM	2025-06-26 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
757	Other	OPEN GYM	2025-07-03 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
758	Other	OPEN GYM	2025-07-10 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
759	Other	OPEN GYM	2025-07-17 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
760	Other	OPEN GYM	2025-07-24 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
761	Other	OPEN GYM	2025-07-31 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
762	Other	OPEN GYM	2025-08-07 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
763	Other	OPEN GYM	2025-08-14 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
764	Other	OPEN GYM	2025-08-21 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
765	Other	OPEN GYM	2025-08-28 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
766	Other	OPEN GYM	2025-09-04 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
767	Other	OPEN GYM	2025-09-11 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
768	Other	OPEN GYM	2025-09-18 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
769	Other	OPEN GYM	2025-09-25 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
770	Other	OPEN GYM	2025-10-02 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
771	Other	OPEN GYM	2025-10-09 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
772	Other	OPEN GYM	2025-10-16 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
773	Other	OPEN GYM	2025-10-23 12:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
774	Other	OPEN GYM	2025-10-30 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
775	Other	OPEN GYM	2025-11-06 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
776	Other	OPEN GYM	2025-11-13 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
777	Other	OPEN GYM	2025-11-20 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
778	Other	OPEN GYM	2025-11-27 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
779	Other	OPEN GYM	2025-12-04 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
780	Other	OPEN GYM	2025-12-11 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
781	Other	OPEN GYM	2025-12-18 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
782	Other	OPEN GYM	2025-12-25 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
783	Other	OPEN GYM	2026-01-01 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
784	Other	OPEN GYM	2026-01-08 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
785	Other	OPEN GYM	2026-01-15 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
786	Other	OPEN GYM	2026-01-22 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
787	Other	OPEN GYM	2026-01-29 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
788	Other	OPEN GYM	2026-02-05 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
789	Other	OPEN GYM	2026-02-12 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
790	Other	OPEN GYM	2026-02-19 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
791	Other	OPEN GYM	2026-02-26 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
792	Other	OPEN GYM	2026-03-05 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
793	Other	OPEN GYM	2026-03-12 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
794	Other	OPEN GYM	2026-03-19 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
795	Other	OPEN GYM	2026-03-26 13:00:00	120	Treener	10	CFV	t	1	1	743	\N	\N	\N	t	f
796	Other	OPEN GYM	2025-03-27 15:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
797	Other	OPEN GYM	2025-04-03 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
798	Other	OPEN GYM	2025-04-10 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
799	Other	OPEN GYM	2025-04-17 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
800	Other	OPEN GYM	2025-04-24 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
801	Other	OPEN GYM	2025-05-01 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
802	Other	OPEN GYM	2025-05-08 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
803	Other	OPEN GYM	2025-05-15 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
804	Other	OPEN GYM	2025-05-22 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
805	Other	OPEN GYM	2025-05-29 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
806	Other	OPEN GYM	2025-06-05 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
807	Other	OPEN GYM	2025-06-12 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
808	Other	OPEN GYM	2025-06-19 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
809	Other	OPEN GYM	2025-06-26 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
810	Other	OPEN GYM	2025-07-03 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
811	Other	OPEN GYM	2025-07-10 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
812	Other	OPEN GYM	2025-07-17 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
813	Other	OPEN GYM	2025-07-24 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
814	Other	OPEN GYM	2025-07-31 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
815	Other	OPEN GYM	2025-08-07 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
816	Other	OPEN GYM	2025-08-14 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
817	Other	OPEN GYM	2025-08-21 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
818	Other	OPEN GYM	2025-08-28 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
819	Other	OPEN GYM	2025-09-04 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
820	Other	OPEN GYM	2025-09-11 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
821	Other	OPEN GYM	2025-09-18 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
822	Other	OPEN GYM	2025-09-25 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
823	Other	OPEN GYM	2025-10-02 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
824	Other	OPEN GYM	2025-10-09 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
825	Other	OPEN GYM	2025-10-16 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
826	Other	OPEN GYM	2025-10-23 14:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
827	Other	OPEN GYM	2025-10-30 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
828	Other	OPEN GYM	2025-11-06 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
829	Other	OPEN GYM	2025-11-13 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
830	Other	OPEN GYM	2025-11-20 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
831	Other	OPEN GYM	2025-11-27 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
832	Other	OPEN GYM	2025-12-04 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
833	Other	OPEN GYM	2025-12-11 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
834	Other	OPEN GYM	2025-12-18 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
835	Other	OPEN GYM	2025-12-25 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
836	Other	OPEN GYM	2026-01-01 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
837	Other	OPEN GYM	2026-01-08 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
838	Other	OPEN GYM	2026-01-15 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
839	Other	OPEN GYM	2026-01-22 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
840	Other	OPEN GYM	2026-01-29 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
841	Other	OPEN GYM	2026-02-05 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
842	Other	OPEN GYM	2026-02-12 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
843	Other	OPEN GYM	2026-02-19 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
844	Other	OPEN GYM	2026-02-26 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
845	Other	OPEN GYM	2026-03-05 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
846	Other	OPEN GYM	2026-03-12 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
847	Other	OPEN GYM	2026-03-19 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
848	Other	OPEN GYM	2026-03-26 15:00:00	120	Treener	10	CFV	t	1	1	796	\N	\N	\N	t	f
849	Other	OPEN GYM	2025-03-28 10:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
850	Other	OPEN GYM	2025-04-04 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
851	Other	OPEN GYM	2025-04-11 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
852	Other	OPEN GYM	2025-04-18 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
853	Other	OPEN GYM	2025-04-25 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
854	Other	OPEN GYM	2025-05-02 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
855	Other	OPEN GYM	2025-05-09 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
856	Other	OPEN GYM	2025-05-16 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
857	Other	OPEN GYM	2025-05-23 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
858	Other	OPEN GYM	2025-05-30 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
859	Other	OPEN GYM	2025-06-06 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
860	Other	OPEN GYM	2025-06-13 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
861	Other	OPEN GYM	2025-06-20 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
862	Other	OPEN GYM	2025-06-27 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
863	Other	OPEN GYM	2025-07-04 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
864	Other	OPEN GYM	2025-07-11 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
865	Other	OPEN GYM	2025-07-18 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
866	Other	OPEN GYM	2025-07-25 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
867	Other	OPEN GYM	2025-08-01 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
868	Other	OPEN GYM	2025-08-08 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
869	Other	OPEN GYM	2025-08-15 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
870	Other	OPEN GYM	2025-08-22 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
871	Other	OPEN GYM	2025-08-29 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
872	Other	OPEN GYM	2025-09-05 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
873	Other	OPEN GYM	2025-09-12 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
874	Other	OPEN GYM	2025-09-19 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
875	Other	OPEN GYM	2025-09-26 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
876	Other	OPEN GYM	2025-10-03 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
877	Other	OPEN GYM	2025-10-10 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
878	Other	OPEN GYM	2025-10-17 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
879	Other	OPEN GYM	2025-10-24 09:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
880	Other	OPEN GYM	2025-10-31 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
881	Other	OPEN GYM	2025-11-07 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
882	Other	OPEN GYM	2025-11-14 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
883	Other	OPEN GYM	2025-11-21 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
884	Other	OPEN GYM	2025-11-28 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
885	Other	OPEN GYM	2025-12-05 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
886	Other	OPEN GYM	2025-12-12 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
887	Other	OPEN GYM	2025-12-19 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
888	Other	OPEN GYM	2025-12-26 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
889	Other	OPEN GYM	2026-01-02 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
890	Other	OPEN GYM	2026-01-09 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
891	Other	OPEN GYM	2026-01-16 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
892	Other	OPEN GYM	2026-01-23 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
893	Other	OPEN GYM	2026-01-30 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
894	Other	OPEN GYM	2026-02-06 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
895	Other	OPEN GYM	2026-02-13 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
896	Other	OPEN GYM	2026-02-20 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
897	Other	OPEN GYM	2026-02-27 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
898	Other	OPEN GYM	2026-03-06 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
899	Other	OPEN GYM	2026-03-13 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
900	Other	OPEN GYM	2026-03-20 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
901	Other	OPEN GYM	2026-03-27 10:00:00	120	Treener	10	CFV	t	1	1	849	\N	\N	\N	t	f
902	Other	OPEN GYM	2025-03-28 13:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
903	Other	OPEN GYM	2025-04-04 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
904	Other	OPEN GYM	2025-04-11 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
905	Other	OPEN GYM	2025-04-18 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
906	Other	OPEN GYM	2025-04-25 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
907	Other	OPEN GYM	2025-05-02 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
908	Other	OPEN GYM	2025-05-09 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
909	Other	OPEN GYM	2025-05-16 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
910	Other	OPEN GYM	2025-05-23 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
911	Other	OPEN GYM	2025-05-30 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
912	Other	OPEN GYM	2025-06-06 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
913	Other	OPEN GYM	2025-06-13 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
914	Other	OPEN GYM	2025-06-20 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
915	Other	OPEN GYM	2025-06-27 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
916	Other	OPEN GYM	2025-07-04 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
917	Other	OPEN GYM	2025-07-11 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
918	Other	OPEN GYM	2025-07-18 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
919	Other	OPEN GYM	2025-07-25 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
920	Other	OPEN GYM	2025-08-01 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
921	Other	OPEN GYM	2025-08-08 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
922	Other	OPEN GYM	2025-08-15 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
923	Other	OPEN GYM	2025-08-22 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
924	Other	OPEN GYM	2025-08-29 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
925	Other	OPEN GYM	2025-09-05 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
926	Other	OPEN GYM	2025-09-12 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
927	Other	OPEN GYM	2025-09-19 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
928	Other	OPEN GYM	2025-09-26 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
929	Other	OPEN GYM	2025-10-03 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
930	Other	OPEN GYM	2025-10-10 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
931	Other	OPEN GYM	2025-10-17 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
932	Other	OPEN GYM	2025-10-24 12:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
933	Other	OPEN GYM	2025-10-31 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
934	Other	OPEN GYM	2025-11-07 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
935	Other	OPEN GYM	2025-11-14 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
936	Other	OPEN GYM	2025-11-21 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
937	Other	OPEN GYM	2025-11-28 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
938	Other	OPEN GYM	2025-12-05 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
939	Other	OPEN GYM	2025-12-12 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
940	Other	OPEN GYM	2025-12-19 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
941	Other	OPEN GYM	2025-12-26 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
942	Other	OPEN GYM	2026-01-02 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
943	Other	OPEN GYM	2026-01-09 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
944	Other	OPEN GYM	2026-01-16 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
945	Other	OPEN GYM	2026-01-23 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
946	Other	OPEN GYM	2026-01-30 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
947	Other	OPEN GYM	2026-02-06 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
948	Other	OPEN GYM	2026-02-13 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
949	Other	OPEN GYM	2026-02-20 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
950	Other	OPEN GYM	2026-02-27 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
951	Other	OPEN GYM	2026-03-06 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
952	Other	OPEN GYM	2026-03-13 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
953	Other	OPEN GYM	2026-03-20 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
954	Other	OPEN GYM	2026-03-27 13:00:00	120	Treener	10	CFV	t	1	1	902	\N	\N	\N	t	f
1008	Other	OPEN GYM	2025-03-29 10:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
1009	Other	OPEN GYM	2025-04-05 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1010	Other	OPEN GYM	2025-04-12 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1011	Other	OPEN GYM	2025-04-19 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1012	Other	OPEN GYM	2025-04-26 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1013	Other	OPEN GYM	2025-05-03 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1014	Other	OPEN GYM	2025-05-10 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1015	Other	OPEN GYM	2025-05-17 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1016	Other	OPEN GYM	2025-05-24 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1017	Other	OPEN GYM	2025-05-31 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1018	Other	OPEN GYM	2025-06-07 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1019	Other	OPEN GYM	2025-06-14 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1020	Other	OPEN GYM	2025-06-21 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1021	Other	OPEN GYM	2025-06-28 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1022	Other	OPEN GYM	2025-07-05 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1023	Other	OPEN GYM	2025-07-12 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1024	Other	OPEN GYM	2025-07-19 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1025	Other	OPEN GYM	2025-07-26 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1026	Other	OPEN GYM	2025-08-02 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1027	Other	OPEN GYM	2025-08-09 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1028	Other	OPEN GYM	2025-08-16 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1029	Other	OPEN GYM	2025-08-23 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1030	Other	OPEN GYM	2025-08-30 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1031	Other	OPEN GYM	2025-09-06 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1032	Other	OPEN GYM	2025-09-13 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1033	Other	OPEN GYM	2025-09-20 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1034	Other	OPEN GYM	2025-09-27 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1035	Other	OPEN GYM	2025-10-04 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1036	Other	OPEN GYM	2025-10-11 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1037	Other	OPEN GYM	2025-10-18 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1038	Other	OPEN GYM	2025-10-25 09:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1039	Other	OPEN GYM	2025-11-01 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1040	Other	OPEN GYM	2025-11-08 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1041	Other	OPEN GYM	2025-11-15 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1042	Other	OPEN GYM	2025-11-22 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1043	Other	OPEN GYM	2025-11-29 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1044	Other	OPEN GYM	2025-12-06 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1045	Other	OPEN GYM	2025-12-13 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1046	Other	OPEN GYM	2025-12-20 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
955	Other	OPEN GYM	2025-03-28 16:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
956	Other	OPEN GYM	2025-04-04 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
957	Other	OPEN GYM	2025-04-11 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
958	Other	OPEN GYM	2025-04-18 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
959	Other	OPEN GYM	2025-04-25 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
960	Other	OPEN GYM	2025-05-02 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
961	Other	OPEN GYM	2025-05-09 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
962	Other	OPEN GYM	2025-05-16 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
963	Other	OPEN GYM	2025-05-23 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
964	Other	OPEN GYM	2025-05-30 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
965	Other	OPEN GYM	2025-06-06 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
966	Other	OPEN GYM	2025-06-13 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
967	Other	OPEN GYM	2025-06-20 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
968	Other	OPEN GYM	2025-06-27 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
969	Other	OPEN GYM	2025-07-04 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
970	Other	OPEN GYM	2025-07-11 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
971	Other	OPEN GYM	2025-07-18 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
972	Other	OPEN GYM	2025-07-25 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
973	Other	OPEN GYM	2025-08-01 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
974	Other	OPEN GYM	2025-08-08 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
975	Other	OPEN GYM	2025-08-15 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
976	Other	OPEN GYM	2025-08-22 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
977	Other	OPEN GYM	2025-08-29 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
978	Other	OPEN GYM	2025-09-05 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
979	Other	OPEN GYM	2025-09-12 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
980	Other	OPEN GYM	2025-09-19 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
981	Other	OPEN GYM	2025-09-26 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
982	Other	OPEN GYM	2025-10-03 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
983	Other	OPEN GYM	2025-10-10 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
984	Other	OPEN GYM	2025-10-17 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
985	Other	OPEN GYM	2025-10-24 15:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
986	Other	OPEN GYM	2025-10-31 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
987	Other	OPEN GYM	2025-11-07 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
988	Other	OPEN GYM	2025-11-14 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
989	Other	OPEN GYM	2025-11-21 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
990	Other	OPEN GYM	2025-11-28 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
991	Other	OPEN GYM	2025-12-05 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
992	Other	OPEN GYM	2025-12-12 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
993	Other	OPEN GYM	2025-12-19 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
994	Other	OPEN GYM	2025-12-26 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
995	Other	OPEN GYM	2026-01-02 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
996	Other	OPEN GYM	2026-01-09 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
997	Other	OPEN GYM	2026-01-16 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
998	Other	OPEN GYM	2026-01-23 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
999	Other	OPEN GYM	2026-01-30 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
1000	Other	OPEN GYM	2026-02-06 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
1001	Other	OPEN GYM	2026-02-13 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
1002	Other	OPEN GYM	2026-02-20 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
1003	Other	OPEN GYM	2026-02-27 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
1004	Other	OPEN GYM	2026-03-06 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
1005	Other	OPEN GYM	2026-03-13 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
1006	Other	OPEN GYM	2026-03-20 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
1007	Other	OPEN GYM	2026-03-27 16:00:00	120	Treener	10	CFV	t	1	1	955	\N	\N	\N	t	f
1061	Other	OPEN GYM	2025-03-30 09:00:00	120	Treener	10	CFV	t	1	1	\N		For Time	\N	t	f
1062	Other	OPEN GYM	2025-04-06 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1063	Other	OPEN GYM	2025-04-13 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1064	Other	OPEN GYM	2025-04-20 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1065	Other	OPEN GYM	2025-04-27 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1066	Other	OPEN GYM	2025-05-04 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1067	Other	OPEN GYM	2025-05-11 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1068	Other	OPEN GYM	2025-05-18 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1069	Other	OPEN GYM	2025-05-25 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1070	Other	OPEN GYM	2025-06-01 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1071	Other	OPEN GYM	2025-06-08 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1072	Other	OPEN GYM	2025-06-15 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1073	Other	OPEN GYM	2025-06-22 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1074	Other	OPEN GYM	2025-06-29 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1075	Other	OPEN GYM	2025-07-06 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1076	Other	OPEN GYM	2025-07-13 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1077	Other	OPEN GYM	2025-07-20 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1078	Other	OPEN GYM	2025-07-27 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1079	Other	OPEN GYM	2025-08-03 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1080	Other	OPEN GYM	2025-08-10 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1081	Other	OPEN GYM	2025-08-17 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1082	Other	OPEN GYM	2025-08-24 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1047	Other	OPEN GYM	2025-12-27 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1048	Other	OPEN GYM	2026-01-03 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1049	Other	OPEN GYM	2026-01-10 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1050	Other	OPEN GYM	2026-01-17 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1051	Other	OPEN GYM	2026-01-24 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1052	Other	OPEN GYM	2026-01-31 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1053	Other	OPEN GYM	2026-02-07 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1054	Other	OPEN GYM	2026-02-14 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1055	Other	OPEN GYM	2026-02-21 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1056	Other	OPEN GYM	2026-02-28 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1057	Other	OPEN GYM	2026-03-07 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1058	Other	OPEN GYM	2026-03-14 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1059	Other	OPEN GYM	2026-03-21 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1060	Other	OPEN GYM	2026-03-28 10:00:00	120	Treener	10	CFV	t	1	1	1008	\N	\N	\N	t	f
1485	WOD	CROSSFIT	2025-03-25 15:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
1486	WOD	CROSSFIT	2025-04-01 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1487	WOD	CROSSFIT	2025-04-08 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1488	WOD	CROSSFIT	2025-04-15 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1489	WOD	CROSSFIT	2025-04-22 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1490	WOD	CROSSFIT	2025-04-29 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1491	WOD	CROSSFIT	2025-05-06 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1492	WOD	CROSSFIT	2025-05-13 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1493	WOD	CROSSFIT	2025-05-20 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1494	WOD	CROSSFIT	2025-05-27 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1495	WOD	CROSSFIT	2025-06-03 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1496	WOD	CROSSFIT	2025-06-10 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1497	WOD	CROSSFIT	2025-06-17 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1498	WOD	CROSSFIT	2025-06-24 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1499	WOD	CROSSFIT	2025-07-01 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1500	WOD	CROSSFIT	2025-07-08 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1501	WOD	CROSSFIT	2025-07-15 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1502	WOD	CROSSFIT	2025-07-22 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1503	WOD	CROSSFIT	2025-07-29 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1504	WOD	CROSSFIT	2025-08-05 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1505	WOD	CROSSFIT	2025-08-12 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1506	WOD	CROSSFIT	2025-08-19 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1507	WOD	CROSSFIT	2025-08-26 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1508	WOD	CROSSFIT	2025-09-02 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1509	WOD	CROSSFIT	2025-09-09 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1510	WOD	CROSSFIT	2025-09-16 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1511	WOD	CROSSFIT	2025-09-23 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1512	WOD	CROSSFIT	2025-09-30 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1513	WOD	CROSSFIT	2025-10-07 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1514	WOD	CROSSFIT	2025-10-14 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1515	WOD	CROSSFIT	2025-10-21 14:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1516	WOD	CROSSFIT	2025-10-28 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1517	WOD	CROSSFIT	2025-11-04 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1518	WOD	CROSSFIT	2025-11-11 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1519	WOD	CROSSFIT	2025-11-18 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1520	WOD	CROSSFIT	2025-11-25 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1521	WOD	CROSSFIT	2025-12-02 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1522	WOD	CROSSFIT	2025-12-09 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1523	WOD	CROSSFIT	2025-12-16 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1524	WOD	CROSSFIT	2025-12-23 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1525	WOD	CROSSFIT	2025-12-30 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1526	WOD	CROSSFIT	2026-01-06 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1527	WOD	CROSSFIT	2026-01-13 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1528	WOD	CROSSFIT	2026-01-20 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1529	WOD	CROSSFIT	2026-01-27 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1530	WOD	CROSSFIT	2026-02-03 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1531	WOD	CROSSFIT	2026-02-10 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1532	WOD	CROSSFIT	2026-02-17 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1533	WOD	CROSSFIT	2026-02-24 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1534	WOD	CROSSFIT	2026-03-03 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1535	WOD	CROSSFIT	2026-03-10 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1536	WOD	CROSSFIT	2026-03-17 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1537	WOD	CROSSFIT	2026-03-24 15:00:00	60	Treener	14	CFV	t	1	1	1485	\N	\N	\N	t	f
1538	WOD	CROSSFIT	2025-03-26 10:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
1539	WOD	CROSSFIT	2025-04-02 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1540	WOD	CROSSFIT	2025-04-09 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1541	WOD	CROSSFIT	2025-04-16 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1542	WOD	CROSSFIT	2025-04-23 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1543	WOD	CROSSFIT	2025-04-30 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1544	WOD	CROSSFIT	2025-05-07 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1545	WOD	CROSSFIT	2025-05-14 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1083	Other	OPEN GYM	2025-08-31 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1084	Other	OPEN GYM	2025-09-07 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1085	Other	OPEN GYM	2025-09-14 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1086	Other	OPEN GYM	2025-09-21 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1087	Other	OPEN GYM	2025-09-28 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1088	Other	OPEN GYM	2025-10-05 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1089	Other	OPEN GYM	2025-10-12 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1090	Other	OPEN GYM	2025-10-19 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1091	Other	OPEN GYM	2025-10-26 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1092	Other	OPEN GYM	2025-11-02 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1093	Other	OPEN GYM	2025-11-09 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1094	Other	OPEN GYM	2025-11-16 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1095	Other	OPEN GYM	2025-11-23 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1096	Other	OPEN GYM	2025-11-30 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1097	Other	OPEN GYM	2025-12-07 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1098	Other	OPEN GYM	2025-12-14 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1099	Other	OPEN GYM	2025-12-21 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1100	Other	OPEN GYM	2025-12-28 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1101	Other	OPEN GYM	2026-01-04 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1102	Other	OPEN GYM	2026-01-11 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1103	Other	OPEN GYM	2026-01-18 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1104	Other	OPEN GYM	2026-01-25 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1105	Other	OPEN GYM	2026-02-01 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1106	Other	OPEN GYM	2026-02-08 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1107	Other	OPEN GYM	2026-02-15 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1108	Other	OPEN GYM	2026-02-22 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1109	Other	OPEN GYM	2026-03-01 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1110	Other	OPEN GYM	2026-03-08 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1111	Other	OPEN GYM	2026-03-15 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1112	Other	OPEN GYM	2026-03-22 10:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1113	Other	OPEN GYM	2026-03-29 09:00:00	120	Treener	10	CFV	t	1	1	1061	\N	\N	\N	t	f
1114	Weightlifting	Weightlifting	2025-03-24 14:15:00	90	Treener	8	CFV	t	1	1	\N		For Time	\N	t	f
1115	Weightlifting	Weightlifting	2025-03-31 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1116	Weightlifting	Weightlifting	2025-04-07 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1117	Weightlifting	Weightlifting	2025-04-14 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1118	Weightlifting	Weightlifting	2025-04-21 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1119	Weightlifting	Weightlifting	2025-04-28 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1120	Weightlifting	Weightlifting	2025-05-05 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1121	Weightlifting	Weightlifting	2025-05-12 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1122	Weightlifting	Weightlifting	2025-05-19 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1123	Weightlifting	Weightlifting	2025-05-26 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1124	Weightlifting	Weightlifting	2025-06-02 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1125	Weightlifting	Weightlifting	2025-06-09 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1126	Weightlifting	Weightlifting	2025-06-16 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1127	Weightlifting	Weightlifting	2025-06-23 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1128	Weightlifting	Weightlifting	2025-06-30 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1129	Weightlifting	Weightlifting	2025-07-07 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1130	Weightlifting	Weightlifting	2025-07-14 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1131	Weightlifting	Weightlifting	2025-07-21 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1132	Weightlifting	Weightlifting	2025-07-28 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1133	Weightlifting	Weightlifting	2025-08-04 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1134	Weightlifting	Weightlifting	2025-08-11 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1135	Weightlifting	Weightlifting	2025-08-18 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1136	Weightlifting	Weightlifting	2025-08-25 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1137	Weightlifting	Weightlifting	2025-09-01 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1138	Weightlifting	Weightlifting	2025-09-08 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1139	Weightlifting	Weightlifting	2025-09-15 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1140	Weightlifting	Weightlifting	2025-09-22 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1141	Weightlifting	Weightlifting	2025-09-29 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1142	Weightlifting	Weightlifting	2025-10-06 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1143	Weightlifting	Weightlifting	2025-10-13 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1144	Weightlifting	Weightlifting	2025-10-20 13:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1145	Weightlifting	Weightlifting	2025-10-27 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1146	Weightlifting	Weightlifting	2025-11-03 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1147	Weightlifting	Weightlifting	2025-11-10 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1148	Weightlifting	Weightlifting	2025-11-17 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1149	Weightlifting	Weightlifting	2025-11-24 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1150	Weightlifting	Weightlifting	2025-12-01 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1151	Weightlifting	Weightlifting	2025-12-08 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1152	Weightlifting	Weightlifting	2025-12-15 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1153	Weightlifting	Weightlifting	2025-12-22 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1154	Weightlifting	Weightlifting	2025-12-29 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1155	Weightlifting	Weightlifting	2026-01-05 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1156	Weightlifting	Weightlifting	2026-01-12 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1157	Weightlifting	Weightlifting	2026-01-19 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1158	Weightlifting	Weightlifting	2026-01-26 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1159	Weightlifting	Weightlifting	2026-02-02 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1160	Weightlifting	Weightlifting	2026-02-09 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1161	Weightlifting	Weightlifting	2026-02-16 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1162	Weightlifting	Weightlifting	2026-02-23 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1163	Weightlifting	Weightlifting	2026-03-02 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1164	Weightlifting	Weightlifting	2026-03-09 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1165	Weightlifting	Weightlifting	2026-03-16 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1166	Weightlifting	Weightlifting	2026-03-23 14:15:00	90	Treener	8	CFV	t	1	1	1114	\N	\N	\N	t	f
1167	Weightlifting	Weightlifting	2025-03-25 14:15:00	90	Treener	8	CFV	t	1	1	\N		For Time	\N	t	f
1168	Weightlifting	Weightlifting	2025-04-01 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1169	Weightlifting	Weightlifting	2025-04-08 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1170	Weightlifting	Weightlifting	2025-04-15 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1171	Weightlifting	Weightlifting	2025-04-22 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1172	Weightlifting	Weightlifting	2025-04-29 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1173	Weightlifting	Weightlifting	2025-05-06 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1174	Weightlifting	Weightlifting	2025-05-13 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1175	Weightlifting	Weightlifting	2025-05-20 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1176	Weightlifting	Weightlifting	2025-05-27 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1177	Weightlifting	Weightlifting	2025-06-03 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1178	Weightlifting	Weightlifting	2025-06-10 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1179	Weightlifting	Weightlifting	2025-06-17 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1180	Weightlifting	Weightlifting	2025-06-24 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1181	Weightlifting	Weightlifting	2025-07-01 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1182	Weightlifting	Weightlifting	2025-07-08 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1183	Weightlifting	Weightlifting	2025-07-15 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1184	Weightlifting	Weightlifting	2025-07-22 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1185	Weightlifting	Weightlifting	2025-07-29 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1186	Weightlifting	Weightlifting	2025-08-05 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1187	Weightlifting	Weightlifting	2025-08-12 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1188	Weightlifting	Weightlifting	2025-08-19 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1189	Weightlifting	Weightlifting	2025-08-26 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1190	Weightlifting	Weightlifting	2025-09-02 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1191	Weightlifting	Weightlifting	2025-09-09 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1192	Weightlifting	Weightlifting	2025-09-16 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1193	Weightlifting	Weightlifting	2025-09-23 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1194	Weightlifting	Weightlifting	2025-09-30 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1195	Weightlifting	Weightlifting	2025-10-07 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1196	Weightlifting	Weightlifting	2025-10-14 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1197	Weightlifting	Weightlifting	2025-10-21 13:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1198	Weightlifting	Weightlifting	2025-10-28 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1199	Weightlifting	Weightlifting	2025-11-04 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1200	Weightlifting	Weightlifting	2025-11-11 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1201	Weightlifting	Weightlifting	2025-11-18 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1202	Weightlifting	Weightlifting	2025-11-25 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1203	Weightlifting	Weightlifting	2025-12-02 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1204	Weightlifting	Weightlifting	2025-12-09 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1205	Weightlifting	Weightlifting	2025-12-16 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1206	Weightlifting	Weightlifting	2025-12-23 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1207	Weightlifting	Weightlifting	2025-12-30 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1208	Weightlifting	Weightlifting	2026-01-06 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1209	Weightlifting	Weightlifting	2026-01-13 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1210	Weightlifting	Weightlifting	2026-01-20 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1211	Weightlifting	Weightlifting	2026-01-27 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1212	Weightlifting	Weightlifting	2026-02-03 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1213	Weightlifting	Weightlifting	2026-02-10 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1214	Weightlifting	Weightlifting	2026-02-17 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1215	Weightlifting	Weightlifting	2026-02-24 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1216	Weightlifting	Weightlifting	2026-03-03 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1217	Weightlifting	Weightlifting	2026-03-10 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1218	Weightlifting	Weightlifting	2026-03-17 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1219	Weightlifting	Weightlifting	2026-03-24 14:15:00	90	Treener	8	CFV	t	1	1	1167	\N	\N	\N	t	f
1220	Weightlifting	Weightlifting	2025-03-26 14:15:00	90	Treener	8	CFV	t	1	1	\N		For Time	\N	t	f
1221	Weightlifting	Weightlifting	2025-04-02 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1222	Weightlifting	Weightlifting	2025-04-09 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1223	Weightlifting	Weightlifting	2025-04-16 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1224	Weightlifting	Weightlifting	2025-04-23 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1225	Weightlifting	Weightlifting	2025-04-30 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1226	Weightlifting	Weightlifting	2025-05-07 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1227	Weightlifting	Weightlifting	2025-05-14 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1228	Weightlifting	Weightlifting	2025-05-21 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1229	Weightlifting	Weightlifting	2025-05-28 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1230	Weightlifting	Weightlifting	2025-06-04 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1231	Weightlifting	Weightlifting	2025-06-11 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1232	Weightlifting	Weightlifting	2025-06-18 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1233	Weightlifting	Weightlifting	2025-06-25 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1234	Weightlifting	Weightlifting	2025-07-02 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1235	Weightlifting	Weightlifting	2025-07-09 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1236	Weightlifting	Weightlifting	2025-07-16 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1237	Weightlifting	Weightlifting	2025-07-23 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1238	Weightlifting	Weightlifting	2025-07-30 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1239	Weightlifting	Weightlifting	2025-08-06 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1240	Weightlifting	Weightlifting	2025-08-13 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1241	Weightlifting	Weightlifting	2025-08-20 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1242	Weightlifting	Weightlifting	2025-08-27 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1243	Weightlifting	Weightlifting	2025-09-03 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1244	Weightlifting	Weightlifting	2025-09-10 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1245	Weightlifting	Weightlifting	2025-09-17 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1246	Weightlifting	Weightlifting	2025-09-24 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1247	Weightlifting	Weightlifting	2025-10-01 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1248	Weightlifting	Weightlifting	2025-10-08 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1249	Weightlifting	Weightlifting	2025-10-15 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1250	Weightlifting	Weightlifting	2025-10-22 13:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1251	Weightlifting	Weightlifting	2025-10-29 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1252	Weightlifting	Weightlifting	2025-11-05 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1253	Weightlifting	Weightlifting	2025-11-12 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1254	Weightlifting	Weightlifting	2025-11-19 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1255	Weightlifting	Weightlifting	2025-11-26 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1256	Weightlifting	Weightlifting	2025-12-03 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1257	Weightlifting	Weightlifting	2025-12-10 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1258	Weightlifting	Weightlifting	2025-12-17 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1259	Weightlifting	Weightlifting	2025-12-24 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1260	Weightlifting	Weightlifting	2025-12-31 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1261	Weightlifting	Weightlifting	2026-01-07 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1262	Weightlifting	Weightlifting	2026-01-14 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1263	Weightlifting	Weightlifting	2026-01-21 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1264	Weightlifting	Weightlifting	2026-01-28 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1265	Weightlifting	Weightlifting	2026-02-04 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1266	Weightlifting	Weightlifting	2026-02-11 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1267	Weightlifting	Weightlifting	2026-02-18 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1268	Weightlifting	Weightlifting	2026-02-25 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1269	Weightlifting	Weightlifting	2026-03-04 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1270	Weightlifting	Weightlifting	2026-03-11 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1271	Weightlifting	Weightlifting	2026-03-18 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1272	Weightlifting	Weightlifting	2026-03-25 14:15:00	90	Treener	8	CFV	t	1	1	1220	\N	\N	\N	t	f
1273	Weightlifting	Weightlifting	2025-03-27 14:15:00	90	Treener	8	CFV	t	1	1	\N		For Time	\N	t	f
1274	Weightlifting	Weightlifting	2025-04-03 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1275	Weightlifting	Weightlifting	2025-04-10 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1276	Weightlifting	Weightlifting	2025-04-17 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1277	Weightlifting	Weightlifting	2025-04-24 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1278	Weightlifting	Weightlifting	2025-05-01 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1279	Weightlifting	Weightlifting	2025-05-08 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1280	Weightlifting	Weightlifting	2025-05-15 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1281	Weightlifting	Weightlifting	2025-05-22 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1282	Weightlifting	Weightlifting	2025-05-29 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1283	Weightlifting	Weightlifting	2025-06-05 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1284	Weightlifting	Weightlifting	2025-06-12 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1285	Weightlifting	Weightlifting	2025-06-19 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1286	Weightlifting	Weightlifting	2025-06-26 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1287	Weightlifting	Weightlifting	2025-07-03 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1288	Weightlifting	Weightlifting	2025-07-10 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1289	Weightlifting	Weightlifting	2025-07-17 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1290	Weightlifting	Weightlifting	2025-07-24 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1291	Weightlifting	Weightlifting	2025-07-31 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1292	Weightlifting	Weightlifting	2025-08-07 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1293	Weightlifting	Weightlifting	2025-08-14 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1294	Weightlifting	Weightlifting	2025-08-21 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1295	Weightlifting	Weightlifting	2025-08-28 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1296	Weightlifting	Weightlifting	2025-09-04 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1297	Weightlifting	Weightlifting	2025-09-11 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1298	Weightlifting	Weightlifting	2025-09-18 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1299	Weightlifting	Weightlifting	2025-09-25 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1300	Weightlifting	Weightlifting	2025-10-02 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1301	Weightlifting	Weightlifting	2025-10-09 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1302	Weightlifting	Weightlifting	2025-10-16 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1303	Weightlifting	Weightlifting	2025-10-23 13:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1304	Weightlifting	Weightlifting	2025-10-30 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1305	Weightlifting	Weightlifting	2025-11-06 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1306	Weightlifting	Weightlifting	2025-11-13 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1307	Weightlifting	Weightlifting	2025-11-20 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1308	Weightlifting	Weightlifting	2025-11-27 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1309	Weightlifting	Weightlifting	2025-12-04 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1310	Weightlifting	Weightlifting	2025-12-11 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1311	Weightlifting	Weightlifting	2025-12-18 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1312	Weightlifting	Weightlifting	2025-12-25 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1313	Weightlifting	Weightlifting	2026-01-01 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1314	Weightlifting	Weightlifting	2026-01-08 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1315	Weightlifting	Weightlifting	2026-01-15 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1316	Weightlifting	Weightlifting	2026-01-22 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1317	Weightlifting	Weightlifting	2026-01-29 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1318	Weightlifting	Weightlifting	2026-02-05 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1319	Weightlifting	Weightlifting	2026-02-12 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1320	Weightlifting	Weightlifting	2026-02-19 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1321	Weightlifting	Weightlifting	2026-02-26 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1322	Weightlifting	Weightlifting	2026-03-05 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1323	Weightlifting	Weightlifting	2026-03-12 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1324	Weightlifting	Weightlifting	2026-03-19 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1325	Weightlifting	Weightlifting	2026-03-26 14:15:00	90	Treener	8	CFV	t	1	1	1273	\N	\N	\N	t	f
1326	Weightlifting	Weightlifting	2025-03-28 14:15:00	90	Treener	8	CFV	t	1	1	\N		For Time	\N	t	f
1327	Weightlifting	Weightlifting	2025-04-04 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1328	Weightlifting	Weightlifting	2025-04-11 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1329	Weightlifting	Weightlifting	2025-04-18 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1330	Weightlifting	Weightlifting	2025-04-25 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1331	Weightlifting	Weightlifting	2025-05-02 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1332	Weightlifting	Weightlifting	2025-05-09 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1333	Weightlifting	Weightlifting	2025-05-16 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1334	Weightlifting	Weightlifting	2025-05-23 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1335	Weightlifting	Weightlifting	2025-05-30 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1336	Weightlifting	Weightlifting	2025-06-06 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1337	Weightlifting	Weightlifting	2025-06-13 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1338	Weightlifting	Weightlifting	2025-06-20 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1339	Weightlifting	Weightlifting	2025-06-27 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1340	Weightlifting	Weightlifting	2025-07-04 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1341	Weightlifting	Weightlifting	2025-07-11 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1342	Weightlifting	Weightlifting	2025-07-18 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1343	Weightlifting	Weightlifting	2025-07-25 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1344	Weightlifting	Weightlifting	2025-08-01 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1345	Weightlifting	Weightlifting	2025-08-08 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1346	Weightlifting	Weightlifting	2025-08-15 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1347	Weightlifting	Weightlifting	2025-08-22 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1348	Weightlifting	Weightlifting	2025-08-29 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1349	Weightlifting	Weightlifting	2025-09-05 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1350	Weightlifting	Weightlifting	2025-09-12 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1351	Weightlifting	Weightlifting	2025-09-19 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1352	Weightlifting	Weightlifting	2025-09-26 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1353	Weightlifting	Weightlifting	2025-10-03 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1354	Weightlifting	Weightlifting	2025-10-10 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1355	Weightlifting	Weightlifting	2025-10-17 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1356	Weightlifting	Weightlifting	2025-10-24 13:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1357	Weightlifting	Weightlifting	2025-10-31 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1358	Weightlifting	Weightlifting	2025-11-07 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1359	Weightlifting	Weightlifting	2025-11-14 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1360	Weightlifting	Weightlifting	2025-11-21 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1361	Weightlifting	Weightlifting	2025-11-28 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1362	Weightlifting	Weightlifting	2025-12-05 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1363	Weightlifting	Weightlifting	2025-12-12 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1364	Weightlifting	Weightlifting	2025-12-19 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1365	Weightlifting	Weightlifting	2025-12-26 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1366	Weightlifting	Weightlifting	2026-01-02 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1367	Weightlifting	Weightlifting	2026-01-09 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1368	Weightlifting	Weightlifting	2026-01-16 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1369	Weightlifting	Weightlifting	2026-01-23 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1370	Weightlifting	Weightlifting	2026-01-30 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1371	Weightlifting	Weightlifting	2026-02-06 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1372	Weightlifting	Weightlifting	2026-02-13 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1373	Weightlifting	Weightlifting	2026-02-20 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1374	Weightlifting	Weightlifting	2026-02-27 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1375	Weightlifting	Weightlifting	2026-03-06 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1376	Weightlifting	Weightlifting	2026-03-13 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1377	Weightlifting	Weightlifting	2026-03-20 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1378	Weightlifting	Weightlifting	2026-03-27 14:15:00	90	Treener	8	CFV	t	1	1	1326	\N	\N	\N	t	f
1546	WOD	CROSSFIT	2025-05-21 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1547	WOD	CROSSFIT	2025-05-28 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1548	WOD	CROSSFIT	2025-06-04 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1549	WOD	CROSSFIT	2025-06-11 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1550	WOD	CROSSFIT	2025-06-18 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1551	WOD	CROSSFIT	2025-06-25 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1552	WOD	CROSSFIT	2025-07-02 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1553	WOD	CROSSFIT	2025-07-09 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1554	WOD	CROSSFIT	2025-07-16 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1555	WOD	CROSSFIT	2025-07-23 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1556	WOD	CROSSFIT	2025-07-30 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1557	WOD	CROSSFIT	2025-08-06 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1558	WOD	CROSSFIT	2025-08-13 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1559	WOD	CROSSFIT	2025-08-20 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1560	WOD	CROSSFIT	2025-08-27 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1561	WOD	CROSSFIT	2025-09-03 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1562	WOD	CROSSFIT	2025-09-10 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1563	WOD	CROSSFIT	2025-09-17 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1564	WOD	CROSSFIT	2025-09-24 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1565	WOD	CROSSFIT	2025-10-01 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1566	WOD	CROSSFIT	2025-10-08 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1567	WOD	CROSSFIT	2025-10-15 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1568	WOD	CROSSFIT	2025-10-22 09:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1569	WOD	CROSSFIT	2025-10-29 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1570	WOD	CROSSFIT	2025-11-05 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1571	WOD	CROSSFIT	2025-11-12 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1572	WOD	CROSSFIT	2025-11-19 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1573	WOD	CROSSFIT	2025-11-26 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1574	WOD	CROSSFIT	2025-12-03 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1575	WOD	CROSSFIT	2025-12-10 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1576	WOD	CROSSFIT	2025-12-17 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1577	WOD	CROSSFIT	2025-12-24 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1578	WOD	CROSSFIT	2025-12-31 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1579	WOD	CROSSFIT	2026-01-07 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1580	WOD	CROSSFIT	2026-01-14 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1581	WOD	CROSSFIT	2026-01-21 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1582	WOD	CROSSFIT	2026-01-28 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1583	WOD	CROSSFIT	2026-02-04 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1584	WOD	CROSSFIT	2026-02-11 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1585	WOD	CROSSFIT	2026-02-18 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1586	WOD	CROSSFIT	2026-02-25 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1587	WOD	CROSSFIT	2026-03-04 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1588	WOD	CROSSFIT	2026-03-11 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1589	WOD	CROSSFIT	2026-03-18 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1590	WOD	CROSSFIT	2026-03-25 10:00:00	60	Treener	14	CFV	t	1	1	1538	\N	\N	\N	t	f
1591	WOD	CROSSFIT	2025-03-26 13:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
1592	WOD	CROSSFIT	2025-04-02 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1593	WOD	CROSSFIT	2025-04-09 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1594	WOD	CROSSFIT	2025-04-16 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1595	WOD	CROSSFIT	2025-04-23 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1596	WOD	CROSSFIT	2025-04-30 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1597	WOD	CROSSFIT	2025-05-07 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1598	WOD	CROSSFIT	2025-05-14 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1599	WOD	CROSSFIT	2025-05-21 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1600	WOD	CROSSFIT	2025-05-28 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1601	WOD	CROSSFIT	2025-06-04 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1602	WOD	CROSSFIT	2025-06-11 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1603	WOD	CROSSFIT	2025-06-18 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1604	WOD	CROSSFIT	2025-06-25 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1605	WOD	CROSSFIT	2025-07-02 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1379	WOD	CROSSFIT	2025-03-25 08:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
1380	WOD	CROSSFIT	2025-04-01 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1381	WOD	CROSSFIT	2025-04-08 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1382	WOD	CROSSFIT	2025-04-15 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1383	WOD	CROSSFIT	2025-04-22 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1384	WOD	CROSSFIT	2025-04-29 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1385	WOD	CROSSFIT	2025-05-06 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1386	WOD	CROSSFIT	2025-05-13 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1387	WOD	CROSSFIT	2025-05-20 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1388	WOD	CROSSFIT	2025-05-27 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1389	WOD	CROSSFIT	2025-06-03 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1390	WOD	CROSSFIT	2025-06-10 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1391	WOD	CROSSFIT	2025-06-17 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1392	WOD	CROSSFIT	2025-06-24 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1393	WOD	CROSSFIT	2025-07-01 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1394	WOD	CROSSFIT	2025-07-08 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1395	WOD	CROSSFIT	2025-07-15 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1396	WOD	CROSSFIT	2025-07-22 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1397	WOD	CROSSFIT	2025-07-29 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1398	WOD	CROSSFIT	2025-08-05 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1399	WOD	CROSSFIT	2025-08-12 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1400	WOD	CROSSFIT	2025-08-19 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1401	WOD	CROSSFIT	2025-08-26 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1402	WOD	CROSSFIT	2025-09-02 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1403	WOD	CROSSFIT	2025-09-09 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1404	WOD	CROSSFIT	2025-09-16 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1405	WOD	CROSSFIT	2025-09-23 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1406	WOD	CROSSFIT	2025-09-30 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1407	WOD	CROSSFIT	2025-10-07 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1408	WOD	CROSSFIT	2025-10-14 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1409	WOD	CROSSFIT	2025-10-21 07:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1410	WOD	CROSSFIT	2025-10-28 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1411	WOD	CROSSFIT	2025-11-04 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1412	WOD	CROSSFIT	2025-11-11 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1413	WOD	CROSSFIT	2025-11-18 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1414	WOD	CROSSFIT	2025-11-25 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1415	WOD	CROSSFIT	2025-12-02 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1416	WOD	CROSSFIT	2025-12-09 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1417	WOD	CROSSFIT	2025-12-16 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1418	WOD	CROSSFIT	2025-12-23 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1419	WOD	CROSSFIT	2025-12-30 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1420	WOD	CROSSFIT	2026-01-06 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1421	WOD	CROSSFIT	2026-01-13 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1422	WOD	CROSSFIT	2026-01-20 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1423	WOD	CROSSFIT	2026-01-27 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1424	WOD	CROSSFIT	2026-02-03 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1425	WOD	CROSSFIT	2026-02-10 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1426	WOD	CROSSFIT	2026-02-17 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1427	WOD	CROSSFIT	2026-02-24 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1428	WOD	CROSSFIT	2026-03-03 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1429	WOD	CROSSFIT	2026-03-10 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1430	WOD	CROSSFIT	2026-03-17 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1431	WOD	CROSSFIT	2026-03-24 08:00:00	60	Treener	14	CFV	t	1	1	1379	\N	\N	\N	t	f
1606	WOD	CROSSFIT	2025-07-09 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1607	WOD	CROSSFIT	2025-07-16 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1608	WOD	CROSSFIT	2025-07-23 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1609	WOD	CROSSFIT	2025-07-30 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1610	WOD	CROSSFIT	2025-08-06 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1611	WOD	CROSSFIT	2025-08-13 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1612	WOD	CROSSFIT	2025-08-20 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1613	WOD	CROSSFIT	2025-08-27 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1614	WOD	CROSSFIT	2025-09-03 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1615	WOD	CROSSFIT	2025-09-10 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1616	WOD	CROSSFIT	2025-09-17 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1617	WOD	CROSSFIT	2025-09-24 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1618	WOD	CROSSFIT	2025-10-01 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1619	WOD	CROSSFIT	2025-10-08 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1620	WOD	CROSSFIT	2025-10-15 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1621	WOD	CROSSFIT	2025-10-22 12:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1622	WOD	CROSSFIT	2025-10-29 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1623	WOD	CROSSFIT	2025-11-05 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1624	WOD	CROSSFIT	2025-11-12 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1625	WOD	CROSSFIT	2025-11-19 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1626	WOD	CROSSFIT	2025-11-26 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1627	WOD	CROSSFIT	2025-12-03 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1632	WOD	CROSSFIT	2026-01-07 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1633	WOD	CROSSFIT	2026-01-14 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1634	WOD	CROSSFIT	2026-01-21 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1635	WOD	CROSSFIT	2026-01-28 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1636	WOD	CROSSFIT	2026-02-04 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1637	WOD	CROSSFIT	2026-02-11 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1638	WOD	CROSSFIT	2026-02-18 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1639	WOD	CROSSFIT	2026-02-25 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1640	WOD	CROSSFIT	2026-03-04 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1641	WOD	CROSSFIT	2026-03-11 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1642	WOD	CROSSFIT	2026-03-18 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1643	WOD	CROSSFIT	2026-03-25 13:00:00	60	Treener	14	CFV	t	1	1	1591	\N	\N	\N	t	f
1644	WOD	CROSSFIT	2025-03-26 16:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
1645	WOD	CROSSFIT	2025-04-02 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1646	WOD	CROSSFIT	2025-04-09 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1647	WOD	CROSSFIT	2025-04-16 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1648	WOD	CROSSFIT	2025-04-23 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1649	WOD	CROSSFIT	2025-04-30 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1650	WOD	CROSSFIT	2025-05-07 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1651	WOD	CROSSFIT	2025-05-14 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1652	WOD	CROSSFIT	2025-05-21 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1653	WOD	CROSSFIT	2025-05-28 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1654	WOD	CROSSFIT	2025-06-04 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1655	WOD	CROSSFIT	2025-06-11 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1656	WOD	CROSSFIT	2025-06-18 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1657	WOD	CROSSFIT	2025-06-25 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1658	WOD	CROSSFIT	2025-07-02 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1659	WOD	CROSSFIT	2025-07-09 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1660	WOD	CROSSFIT	2025-07-16 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1661	WOD	CROSSFIT	2025-07-23 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1662	WOD	CROSSFIT	2025-07-30 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1663	WOD	CROSSFIT	2025-08-06 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1664	WOD	CROSSFIT	2025-08-13 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1665	WOD	CROSSFIT	2025-08-20 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1666	WOD	CROSSFIT	2025-08-27 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1667	WOD	CROSSFIT	2025-09-03 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1668	WOD	CROSSFIT	2025-09-10 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1669	WOD	CROSSFIT	2025-09-17 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1670	WOD	CROSSFIT	2025-09-24 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1671	WOD	CROSSFIT	2025-10-01 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1672	WOD	CROSSFIT	2025-10-08 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1673	WOD	CROSSFIT	2025-10-15 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1674	WOD	CROSSFIT	2025-10-22 15:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1675	WOD	CROSSFIT	2025-10-29 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1676	WOD	CROSSFIT	2025-11-05 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1677	WOD	CROSSFIT	2025-11-12 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1678	WOD	CROSSFIT	2025-11-19 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1679	WOD	CROSSFIT	2025-11-26 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1680	WOD	CROSSFIT	2025-12-03 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1681	WOD	CROSSFIT	2025-12-10 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1682	WOD	CROSSFIT	2025-12-17 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1683	WOD	CROSSFIT	2025-12-24 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1684	WOD	CROSSFIT	2025-12-31 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1685	WOD	CROSSFIT	2026-01-07 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1686	WOD	CROSSFIT	2026-01-14 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1687	WOD	CROSSFIT	2026-01-21 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1688	WOD	CROSSFIT	2026-01-28 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1689	WOD	CROSSFIT	2026-02-04 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1690	WOD	CROSSFIT	2026-02-11 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1691	WOD	CROSSFIT	2026-02-18 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1692	WOD	CROSSFIT	2026-02-25 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1693	WOD	CROSSFIT	2026-03-04 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1694	WOD	CROSSFIT	2026-03-11 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1695	WOD	CROSSFIT	2026-03-18 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1696	WOD	CROSSFIT	2026-03-25 16:00:00	60	Treener	14	CFV	t	1	1	1644	\N	\N	\N	t	f
1697	WOD	CROSSFIT	2025-03-27 11:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
1698	WOD	CROSSFIT	2025-04-03 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1699	WOD	CROSSFIT	2025-04-10 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1700	WOD	CROSSFIT	2025-04-17 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1701	WOD	CROSSFIT	2025-04-24 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1702	WOD	CROSSFIT	2025-05-01 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1703	WOD	CROSSFIT	2025-05-08 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1704	WOD	CROSSFIT	2025-05-15 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1705	WOD	CROSSFIT	2025-05-22 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1706	WOD	CROSSFIT	2025-05-29 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1707	WOD	CROSSFIT	2025-06-05 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1708	WOD	CROSSFIT	2025-06-12 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1709	WOD	CROSSFIT	2025-06-19 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1710	WOD	CROSSFIT	2025-06-26 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1711	WOD	CROSSFIT	2025-07-03 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1712	WOD	CROSSFIT	2025-07-10 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1713	WOD	CROSSFIT	2025-07-17 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1714	WOD	CROSSFIT	2025-07-24 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1715	WOD	CROSSFIT	2025-07-31 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1716	WOD	CROSSFIT	2025-08-07 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1717	WOD	CROSSFIT	2025-08-14 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1718	WOD	CROSSFIT	2025-08-21 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1719	WOD	CROSSFIT	2025-08-28 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1720	WOD	CROSSFIT	2025-09-04 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1721	WOD	CROSSFIT	2025-09-11 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1722	WOD	CROSSFIT	2025-09-18 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1723	WOD	CROSSFIT	2025-09-25 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1724	WOD	CROSSFIT	2025-10-02 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1725	WOD	CROSSFIT	2025-10-09 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1726	WOD	CROSSFIT	2025-10-16 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1727	WOD	CROSSFIT	2025-10-23 10:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1728	WOD	CROSSFIT	2025-10-30 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1729	WOD	CROSSFIT	2025-11-06 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1730	WOD	CROSSFIT	2025-11-13 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1731	WOD	CROSSFIT	2025-11-20 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1732	WOD	CROSSFIT	2025-11-27 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1733	WOD	CROSSFIT	2025-12-04 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1734	WOD	CROSSFIT	2025-12-11 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1735	WOD	CROSSFIT	2025-12-18 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1736	WOD	CROSSFIT	2025-12-25 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1737	WOD	CROSSFIT	2026-01-01 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1738	WOD	CROSSFIT	2026-01-08 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1739	WOD	CROSSFIT	2026-01-15 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1740	WOD	CROSSFIT	2026-01-22 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1741	WOD	CROSSFIT	2026-01-29 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1742	WOD	CROSSFIT	2026-02-05 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1743	WOD	CROSSFIT	2026-02-12 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1744	WOD	CROSSFIT	2026-02-19 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1745	WOD	CROSSFIT	2026-02-26 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1746	WOD	CROSSFIT	2026-03-05 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1747	WOD	CROSSFIT	2026-03-12 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1748	WOD	CROSSFIT	2026-03-19 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
1749	WOD	CROSSFIT	2026-03-26 11:00:00	60	Treener	14	CFV	t	1	1	1697	\N	\N	\N	t	f
3181	WOD	CROSSFIT	2025-03-28 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
3182	WOD	CROSSFIT	2025-04-04 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3183	WOD	CROSSFIT	2025-04-11 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3184	WOD	CROSSFIT	2025-04-18 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3185	WOD	CROSSFIT	2025-04-25 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3186	WOD	CROSSFIT	2025-05-02 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3187	WOD	CROSSFIT	2025-05-09 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3188	WOD	CROSSFIT	2025-05-16 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3189	WOD	CROSSFIT	2025-05-23 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3190	WOD	CROSSFIT	2025-05-30 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3191	WOD	CROSSFIT	2025-06-06 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3192	WOD	CROSSFIT	2025-06-13 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3193	WOD	CROSSFIT	2025-06-20 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3194	WOD	CROSSFIT	2025-06-27 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3195	WOD	CROSSFIT	2025-07-04 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3196	WOD	CROSSFIT	2025-07-11 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3197	WOD	CROSSFIT	2025-07-18 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3198	WOD	CROSSFIT	2025-07-25 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3199	WOD	CROSSFIT	2025-08-01 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3200	WOD	CROSSFIT	2025-08-08 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3201	WOD	CROSSFIT	2025-08-15 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3202	WOD	CROSSFIT	2025-08-22 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3203	WOD	CROSSFIT	2025-08-29 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3204	WOD	CROSSFIT	2025-09-05 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3205	WOD	CROSSFIT	2025-09-12 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3206	WOD	CROSSFIT	2025-09-19 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3207	WOD	CROSSFIT	2025-09-26 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3208	WOD	CROSSFIT	2025-10-03 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3209	WOD	CROSSFIT	2025-10-10 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3210	WOD	CROSSFIT	2025-10-17 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
1750	WOD	CROSSFIT	2025-03-27 13:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
1751	WOD	CROSSFIT	2025-04-03 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1752	WOD	CROSSFIT	2025-04-10 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1753	WOD	CROSSFIT	2025-04-17 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1754	WOD	CROSSFIT	2025-04-24 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1755	WOD	CROSSFIT	2025-05-01 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1756	WOD	CROSSFIT	2025-05-08 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1757	WOD	CROSSFIT	2025-05-15 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1758	WOD	CROSSFIT	2025-05-22 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1759	WOD	CROSSFIT	2025-05-29 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1760	WOD	CROSSFIT	2025-06-05 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1761	WOD	CROSSFIT	2025-06-12 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1762	WOD	CROSSFIT	2025-06-19 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1763	WOD	CROSSFIT	2025-06-26 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1764	WOD	CROSSFIT	2025-07-03 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1765	WOD	CROSSFIT	2025-07-10 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1766	WOD	CROSSFIT	2025-07-17 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1767	WOD	CROSSFIT	2025-07-24 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1768	WOD	CROSSFIT	2025-07-31 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1769	WOD	CROSSFIT	2025-08-07 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1770	WOD	CROSSFIT	2025-08-14 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1771	WOD	CROSSFIT	2025-08-21 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1772	WOD	CROSSFIT	2025-08-28 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1773	WOD	CROSSFIT	2025-09-04 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1774	WOD	CROSSFIT	2025-09-11 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1775	WOD	CROSSFIT	2025-09-18 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1776	WOD	CROSSFIT	2025-09-25 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1777	WOD	CROSSFIT	2025-10-02 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1778	WOD	CROSSFIT	2025-10-09 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1779	WOD	CROSSFIT	2025-10-16 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1780	WOD	CROSSFIT	2025-10-23 12:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1781	WOD	CROSSFIT	2025-10-30 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1782	WOD	CROSSFIT	2025-11-06 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1783	WOD	CROSSFIT	2025-11-13 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1784	WOD	CROSSFIT	2025-11-20 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1785	WOD	CROSSFIT	2025-11-27 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1786	WOD	CROSSFIT	2025-12-04 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1787	WOD	CROSSFIT	2025-12-11 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1788	WOD	CROSSFIT	2025-12-18 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1789	WOD	CROSSFIT	2025-12-25 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1790	WOD	CROSSFIT	2026-01-01 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1791	WOD	CROSSFIT	2026-01-08 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1792	WOD	CROSSFIT	2026-01-15 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1793	WOD	CROSSFIT	2026-01-22 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1794	WOD	CROSSFIT	2026-01-29 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1795	WOD	CROSSFIT	2026-02-05 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1796	WOD	CROSSFIT	2026-02-12 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1797	WOD	CROSSFIT	2026-02-19 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1798	WOD	CROSSFIT	2026-02-26 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1799	WOD	CROSSFIT	2026-03-05 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1800	WOD	CROSSFIT	2026-03-12 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1801	WOD	CROSSFIT	2026-03-19 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1802	WOD	CROSSFIT	2026-03-26 13:00:00	60	Treener	14	CFV	t	1	1	1750	\N	\N	\N	t	f
1803	WOD	CROSSFIT	2025-03-27 16:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
1804	WOD	CROSSFIT	2025-04-03 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1805	WOD	CROSSFIT	2025-04-10 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1806	WOD	CROSSFIT	2025-04-17 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1807	WOD	CROSSFIT	2025-04-24 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1808	WOD	CROSSFIT	2025-05-01 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1809	WOD	CROSSFIT	2025-05-08 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1810	WOD	CROSSFIT	2025-05-15 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1811	WOD	CROSSFIT	2025-05-22 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1812	WOD	CROSSFIT	2025-05-29 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1813	WOD	CROSSFIT	2025-06-05 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1814	WOD	CROSSFIT	2025-06-12 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1815	WOD	CROSSFIT	2025-06-19 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1816	WOD	CROSSFIT	2025-06-26 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1817	WOD	CROSSFIT	2025-07-03 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1818	WOD	CROSSFIT	2025-07-10 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1819	WOD	CROSSFIT	2025-07-17 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1820	WOD	CROSSFIT	2025-07-24 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1821	WOD	CROSSFIT	2025-07-31 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1822	WOD	CROSSFIT	2025-08-07 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1823	WOD	CROSSFIT	2025-08-14 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1824	WOD	CROSSFIT	2025-08-21 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1825	WOD	CROSSFIT	2025-08-28 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1826	WOD	CROSSFIT	2025-09-04 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1827	WOD	CROSSFIT	2025-09-11 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1828	WOD	CROSSFIT	2025-09-18 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1829	WOD	CROSSFIT	2025-09-25 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1830	WOD	CROSSFIT	2025-10-02 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1831	WOD	CROSSFIT	2025-10-09 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1832	WOD	CROSSFIT	2025-10-16 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1833	WOD	CROSSFIT	2025-10-23 15:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1834	WOD	CROSSFIT	2025-10-30 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1835	WOD	CROSSFIT	2025-11-06 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1836	WOD	CROSSFIT	2025-11-13 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1837	WOD	CROSSFIT	2025-11-20 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1838	WOD	CROSSFIT	2025-11-27 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1839	WOD	CROSSFIT	2025-12-04 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1840	WOD	CROSSFIT	2025-12-11 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1841	WOD	CROSSFIT	2025-12-18 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1842	WOD	CROSSFIT	2025-12-25 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1843	WOD	CROSSFIT	2026-01-01 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1844	WOD	CROSSFIT	2026-01-08 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1845	WOD	CROSSFIT	2026-01-15 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1846	WOD	CROSSFIT	2026-01-22 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1847	WOD	CROSSFIT	2026-01-29 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1848	WOD	CROSSFIT	2026-02-05 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1849	WOD	CROSSFIT	2026-02-12 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1850	WOD	CROSSFIT	2026-02-19 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1851	WOD	CROSSFIT	2026-02-26 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1852	WOD	CROSSFIT	2026-03-05 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1853	WOD	CROSSFIT	2026-03-12 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1854	WOD	CROSSFIT	2026-03-19 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1855	WOD	CROSSFIT	2026-03-26 16:00:00	60	Treener	14	CFV	t	1	1	1803	\N	\N	\N	t	f
1856	WOD	CROSSFIT	2025-03-28 11:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
1857	WOD	CROSSFIT	2025-04-04 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1858	WOD	CROSSFIT	2025-04-11 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1859	WOD	CROSSFIT	2025-04-18 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1860	WOD	CROSSFIT	2025-04-25 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1861	WOD	CROSSFIT	2025-05-02 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1862	WOD	CROSSFIT	2025-05-09 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1863	WOD	CROSSFIT	2025-05-16 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1864	WOD	CROSSFIT	2025-05-23 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1865	WOD	CROSSFIT	2025-05-30 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1866	WOD	CROSSFIT	2025-06-06 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1867	WOD	CROSSFIT	2025-06-13 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1868	WOD	CROSSFIT	2025-06-20 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1869	WOD	CROSSFIT	2025-06-27 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1870	WOD	CROSSFIT	2025-07-04 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1871	WOD	CROSSFIT	2025-07-11 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1872	WOD	CROSSFIT	2025-07-18 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1873	WOD	CROSSFIT	2025-07-25 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1874	WOD	CROSSFIT	2025-08-01 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1875	WOD	CROSSFIT	2025-08-08 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1876	WOD	CROSSFIT	2025-08-15 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1877	WOD	CROSSFIT	2025-08-22 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1878	WOD	CROSSFIT	2025-08-29 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1879	WOD	CROSSFIT	2025-09-05 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1880	WOD	CROSSFIT	2025-09-12 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1881	WOD	CROSSFIT	2025-09-19 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1882	WOD	CROSSFIT	2025-09-26 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1883	WOD	CROSSFIT	2025-10-03 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1884	WOD	CROSSFIT	2025-10-10 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1885	WOD	CROSSFIT	2025-10-17 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1886	WOD	CROSSFIT	2025-10-24 10:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1887	WOD	CROSSFIT	2025-10-31 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1888	WOD	CROSSFIT	2025-11-07 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1889	WOD	CROSSFIT	2025-11-14 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1890	WOD	CROSSFIT	2025-11-21 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1891	WOD	CROSSFIT	2025-11-28 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1892	WOD	CROSSFIT	2025-12-05 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1893	WOD	CROSSFIT	2025-12-12 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1894	WOD	CROSSFIT	2025-12-19 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1895	WOD	CROSSFIT	2025-12-26 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1896	WOD	CROSSFIT	2026-01-02 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1897	WOD	CROSSFIT	2026-01-09 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1898	WOD	CROSSFIT	2026-01-16 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1899	WOD	CROSSFIT	2026-01-23 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1900	WOD	CROSSFIT	2026-01-30 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1901	WOD	CROSSFIT	2026-02-06 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1902	WOD	CROSSFIT	2026-02-13 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1903	WOD	CROSSFIT	2026-02-20 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1904	WOD	CROSSFIT	2026-02-27 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1905	WOD	CROSSFIT	2026-03-06 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1906	WOD	CROSSFIT	2026-03-13 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1907	WOD	CROSSFIT	2026-03-20 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1908	WOD	CROSSFIT	2026-03-27 11:00:00	60	Treener	14	CFV	t	1	1	1856	\N	\N	\N	t	f
1909	WOD	CROSSFIT	2025-03-28 14:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
1910	WOD	CROSSFIT	2025-04-04 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1911	WOD	CROSSFIT	2025-04-11 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1912	WOD	CROSSFIT	2025-04-18 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1913	WOD	CROSSFIT	2025-04-25 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1914	WOD	CROSSFIT	2025-05-02 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1915	WOD	CROSSFIT	2025-05-09 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1916	WOD	CROSSFIT	2025-05-16 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1917	WOD	CROSSFIT	2025-05-23 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1918	WOD	CROSSFIT	2025-05-30 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1919	WOD	CROSSFIT	2025-06-06 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1920	WOD	CROSSFIT	2025-06-13 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1921	WOD	CROSSFIT	2025-06-20 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1922	WOD	CROSSFIT	2025-06-27 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1923	WOD	CROSSFIT	2025-07-04 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1924	WOD	CROSSFIT	2025-07-11 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1925	WOD	CROSSFIT	2025-07-18 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1926	WOD	CROSSFIT	2025-07-25 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1927	WOD	CROSSFIT	2025-08-01 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1928	WOD	CROSSFIT	2025-08-08 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1929	WOD	CROSSFIT	2025-08-15 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1930	WOD	CROSSFIT	2025-08-22 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1931	WOD	CROSSFIT	2025-08-29 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1932	WOD	CROSSFIT	2025-09-05 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1933	WOD	CROSSFIT	2025-09-12 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1934	WOD	CROSSFIT	2025-09-19 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1935	WOD	CROSSFIT	2025-09-26 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1936	WOD	CROSSFIT	2025-10-03 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1937	WOD	CROSSFIT	2025-10-10 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1938	WOD	CROSSFIT	2025-10-17 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1939	WOD	CROSSFIT	2025-10-24 13:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1940	WOD	CROSSFIT	2025-10-31 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1941	WOD	CROSSFIT	2025-11-07 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1942	WOD	CROSSFIT	2025-11-14 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1943	WOD	CROSSFIT	2025-11-21 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1944	WOD	CROSSFIT	2025-11-28 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1945	WOD	CROSSFIT	2025-12-05 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1946	WOD	CROSSFIT	2025-12-12 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1947	WOD	CROSSFIT	2025-12-19 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1948	WOD	CROSSFIT	2025-12-26 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1949	WOD	CROSSFIT	2026-01-02 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1950	WOD	CROSSFIT	2026-01-09 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1951	WOD	CROSSFIT	2026-01-16 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1952	WOD	CROSSFIT	2026-01-23 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1953	WOD	CROSSFIT	2026-01-30 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1954	WOD	CROSSFIT	2026-02-06 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1955	WOD	CROSSFIT	2026-02-13 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1956	WOD	CROSSFIT	2026-02-20 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1957	WOD	CROSSFIT	2026-02-27 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1958	WOD	CROSSFIT	2026-03-06 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1959	WOD	CROSSFIT	2026-03-13 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1960	WOD	CROSSFIT	2026-03-20 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1961	WOD	CROSSFIT	2026-03-27 14:00:00	60	Treener	14	CFV	t	1	1	1909	\N	\N	\N	t	f
1962	WOD	CROSSFIT	2025-03-28 16:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
1963	WOD	CROSSFIT	2025-04-04 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1964	WOD	CROSSFIT	2025-04-11 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1965	WOD	CROSSFIT	2025-04-18 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1966	WOD	CROSSFIT	2025-04-25 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1967	WOD	CROSSFIT	2025-05-02 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1968	WOD	CROSSFIT	2025-05-09 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1969	WOD	CROSSFIT	2025-05-16 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1970	WOD	CROSSFIT	2025-05-23 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1971	WOD	CROSSFIT	2025-05-30 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1972	WOD	CROSSFIT	2025-06-06 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1973	WOD	CROSSFIT	2025-06-13 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1974	WOD	CROSSFIT	2025-06-20 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1975	WOD	CROSSFIT	2025-06-27 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1976	WOD	CROSSFIT	2025-07-04 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1977	WOD	CROSSFIT	2025-07-11 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1978	WOD	CROSSFIT	2025-07-18 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1979	WOD	CROSSFIT	2025-07-25 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1980	WOD	CROSSFIT	2025-08-01 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1981	WOD	CROSSFIT	2025-08-08 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1982	WOD	CROSSFIT	2025-08-15 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1983	WOD	CROSSFIT	2025-08-22 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1984	WOD	CROSSFIT	2025-08-29 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1985	WOD	CROSSFIT	2025-09-05 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1986	WOD	CROSSFIT	2025-09-12 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1987	WOD	CROSSFIT	2025-09-19 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1988	WOD	CROSSFIT	2025-09-26 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1989	WOD	CROSSFIT	2025-10-03 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1990	WOD	CROSSFIT	2025-10-10 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1991	WOD	CROSSFIT	2025-10-17 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1992	WOD	CROSSFIT	2025-10-24 15:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1993	WOD	CROSSFIT	2025-10-31 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1994	WOD	CROSSFIT	2025-11-07 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1995	WOD	CROSSFIT	2025-11-14 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1996	WOD	CROSSFIT	2025-11-21 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1997	WOD	CROSSFIT	2025-11-28 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1998	WOD	CROSSFIT	2025-12-05 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
1999	WOD	CROSSFIT	2025-12-12 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2000	WOD	CROSSFIT	2025-12-19 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2001	WOD	CROSSFIT	2025-12-26 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2002	WOD	CROSSFIT	2026-01-02 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2003	WOD	CROSSFIT	2026-01-09 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2004	WOD	CROSSFIT	2026-01-16 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2005	WOD	CROSSFIT	2026-01-23 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2006	WOD	CROSSFIT	2026-01-30 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2007	WOD	CROSSFIT	2026-02-06 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2008	WOD	CROSSFIT	2026-02-13 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2009	WOD	CROSSFIT	2026-02-20 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2010	WOD	CROSSFIT	2026-02-27 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2011	WOD	CROSSFIT	2026-03-06 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2012	WOD	CROSSFIT	2026-03-13 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2013	WOD	CROSSFIT	2026-03-20 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2014	WOD	CROSSFIT	2026-03-27 16:00:00	60	Treener	14	CFV	t	1	1	1962	\N	\N	\N	t	f
2015	WOD	CROSSFIT	2025-03-29 11:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
2016	WOD	CROSSFIT	2025-04-05 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2017	WOD	CROSSFIT	2025-04-12 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2018	WOD	CROSSFIT	2025-04-19 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2019	WOD	CROSSFIT	2025-04-26 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2020	WOD	CROSSFIT	2025-05-03 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2021	WOD	CROSSFIT	2025-05-10 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2022	WOD	CROSSFIT	2025-05-17 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2023	WOD	CROSSFIT	2025-05-24 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2024	WOD	CROSSFIT	2025-05-31 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2025	WOD	CROSSFIT	2025-06-07 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2026	WOD	CROSSFIT	2025-06-14 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2027	WOD	CROSSFIT	2025-06-21 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2028	WOD	CROSSFIT	2025-06-28 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2029	WOD	CROSSFIT	2025-07-05 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2030	WOD	CROSSFIT	2025-07-12 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2031	WOD	CROSSFIT	2025-07-19 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2032	WOD	CROSSFIT	2025-07-26 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2033	WOD	CROSSFIT	2025-08-02 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2034	WOD	CROSSFIT	2025-08-09 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2035	WOD	CROSSFIT	2025-08-16 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2036	WOD	CROSSFIT	2025-08-23 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2037	WOD	CROSSFIT	2025-08-30 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2038	WOD	CROSSFIT	2025-09-06 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2039	WOD	CROSSFIT	2025-09-13 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2040	WOD	CROSSFIT	2025-09-20 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2041	WOD	CROSSFIT	2025-09-27 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2042	WOD	CROSSFIT	2025-10-04 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2043	WOD	CROSSFIT	2025-10-11 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2044	WOD	CROSSFIT	2025-10-18 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2045	WOD	CROSSFIT	2025-10-25 10:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2046	WOD	CROSSFIT	2025-11-01 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2047	WOD	CROSSFIT	2025-11-08 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2048	WOD	CROSSFIT	2025-11-15 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2049	WOD	CROSSFIT	2025-11-22 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2050	WOD	CROSSFIT	2025-11-29 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2051	WOD	CROSSFIT	2025-12-06 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2052	WOD	CROSSFIT	2025-12-13 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2053	WOD	CROSSFIT	2025-12-20 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2054	WOD	CROSSFIT	2025-12-27 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2055	WOD	CROSSFIT	2026-01-03 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2056	WOD	CROSSFIT	2026-01-10 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2057	WOD	CROSSFIT	2026-01-17 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2058	WOD	CROSSFIT	2026-01-24 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2059	WOD	CROSSFIT	2026-01-31 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2060	WOD	CROSSFIT	2026-02-07 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2061	WOD	CROSSFIT	2026-02-14 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2062	WOD	CROSSFIT	2026-02-21 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2063	WOD	CROSSFIT	2026-02-28 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2064	WOD	CROSSFIT	2026-03-07 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2065	WOD	CROSSFIT	2026-03-14 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2066	WOD	CROSSFIT	2026-03-21 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2067	WOD	CROSSFIT	2026-03-28 11:00:00	60	Treener	14	CFV	t	1	1	2015	\N	\N	\N	t	f
2068	WOD	CROSSFIT	2025-03-29 10:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
2069	WOD	CROSSFIT	2025-04-05 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2070	WOD	CROSSFIT	2025-04-12 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2071	WOD	CROSSFIT	2025-04-19 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2072	WOD	CROSSFIT	2025-04-26 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2073	WOD	CROSSFIT	2025-05-03 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2074	WOD	CROSSFIT	2025-05-10 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2075	WOD	CROSSFIT	2025-05-17 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2076	WOD	CROSSFIT	2025-05-24 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2077	WOD	CROSSFIT	2025-05-31 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2078	WOD	CROSSFIT	2025-06-07 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2079	WOD	CROSSFIT	2025-06-14 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2080	WOD	CROSSFIT	2025-06-21 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2081	WOD	CROSSFIT	2025-06-28 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2082	WOD	CROSSFIT	2025-07-05 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2083	WOD	CROSSFIT	2025-07-12 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2084	WOD	CROSSFIT	2025-07-19 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2085	WOD	CROSSFIT	2025-07-26 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2086	WOD	CROSSFIT	2025-08-02 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2087	WOD	CROSSFIT	2025-08-09 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2088	WOD	CROSSFIT	2025-08-16 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2089	WOD	CROSSFIT	2025-08-23 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2090	WOD	CROSSFIT	2025-08-30 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2091	WOD	CROSSFIT	2025-09-06 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2092	WOD	CROSSFIT	2025-09-13 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2093	WOD	CROSSFIT	2025-09-20 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2094	WOD	CROSSFIT	2025-09-27 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2095	WOD	CROSSFIT	2025-10-04 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2096	WOD	CROSSFIT	2025-10-11 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2097	WOD	CROSSFIT	2025-10-18 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2098	WOD	CROSSFIT	2025-10-25 09:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2099	WOD	CROSSFIT	2025-11-01 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2100	WOD	CROSSFIT	2025-11-08 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2101	WOD	CROSSFIT	2025-11-15 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2102	WOD	CROSSFIT	2025-11-22 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2103	WOD	CROSSFIT	2025-11-29 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2104	WOD	CROSSFIT	2025-12-06 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2105	WOD	CROSSFIT	2025-12-13 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2106	WOD	CROSSFIT	2025-12-20 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2107	WOD	CROSSFIT	2025-12-27 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2108	WOD	CROSSFIT	2026-01-03 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2109	WOD	CROSSFIT	2026-01-10 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2110	WOD	CROSSFIT	2026-01-17 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2111	WOD	CROSSFIT	2026-01-24 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2112	WOD	CROSSFIT	2026-01-31 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2113	WOD	CROSSFIT	2026-02-07 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2114	WOD	CROSSFIT	2026-02-14 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2115	WOD	CROSSFIT	2026-02-21 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2116	WOD	CROSSFIT	2026-02-28 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2117	WOD	CROSSFIT	2026-03-07 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2118	WOD	CROSSFIT	2026-03-14 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2119	WOD	CROSSFIT	2026-03-21 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2120	WOD	CROSSFIT	2026-03-28 10:00:00	60	Treener	14	CFV	t	1	1	2068	\N	\N	\N	t	f
2121	WOD	CROSSFIT	2025-03-30 14:00:00	60	Treener	14	CFV	t	1	1	\N		For Time	\N	t	f
2122	WOD	CROSSFIT	2025-04-06 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2123	WOD	CROSSFIT	2025-04-13 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2124	WOD	CROSSFIT	2025-04-20 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2125	WOD	CROSSFIT	2025-04-27 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2126	WOD	CROSSFIT	2025-05-04 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2127	WOD	CROSSFIT	2025-05-11 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2128	WOD	CROSSFIT	2025-05-18 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2129	WOD	CROSSFIT	2025-05-25 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2130	WOD	CROSSFIT	2025-06-01 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2131	WOD	CROSSFIT	2025-06-08 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2132	WOD	CROSSFIT	2025-06-15 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2133	WOD	CROSSFIT	2025-06-22 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2134	WOD	CROSSFIT	2025-06-29 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2135	WOD	CROSSFIT	2025-07-06 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2136	WOD	CROSSFIT	2025-07-13 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2137	WOD	CROSSFIT	2025-07-20 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2138	WOD	CROSSFIT	2025-07-27 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2139	WOD	CROSSFIT	2025-08-03 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2140	WOD	CROSSFIT	2025-08-10 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2141	WOD	CROSSFIT	2025-08-17 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2142	WOD	CROSSFIT	2025-08-24 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2143	WOD	CROSSFIT	2025-08-31 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2144	WOD	CROSSFIT	2025-09-07 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2145	WOD	CROSSFIT	2025-09-14 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2146	WOD	CROSSFIT	2025-09-21 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2147	WOD	CROSSFIT	2025-09-28 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2148	WOD	CROSSFIT	2025-10-05 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2149	WOD	CROSSFIT	2025-10-12 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2150	WOD	CROSSFIT	2025-10-19 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2151	WOD	CROSSFIT	2025-10-26 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2152	WOD	CROSSFIT	2025-11-02 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2153	WOD	CROSSFIT	2025-11-09 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2154	WOD	CROSSFIT	2025-11-16 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2155	WOD	CROSSFIT	2025-11-23 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2156	WOD	CROSSFIT	2025-11-30 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2157	WOD	CROSSFIT	2025-12-07 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2158	WOD	CROSSFIT	2025-12-14 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2159	WOD	CROSSFIT	2025-12-21 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2160	WOD	CROSSFIT	2025-12-28 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2161	WOD	CROSSFIT	2026-01-04 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2162	WOD	CROSSFIT	2026-01-11 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2163	WOD	CROSSFIT	2026-01-18 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2164	WOD	CROSSFIT	2026-01-25 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2165	WOD	CROSSFIT	2026-02-01 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2166	WOD	CROSSFIT	2026-02-08 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2167	WOD	CROSSFIT	2026-02-15 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2168	WOD	CROSSFIT	2026-02-22 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2169	WOD	CROSSFIT	2026-03-01 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2170	WOD	CROSSFIT	2026-03-08 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2171	WOD	CROSSFIT	2026-03-15 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2172	WOD	CROSSFIT	2026-03-22 15:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2173	WOD	CROSSFIT	2026-03-29 14:00:00	60	Treener	14	CFV	t	1	1	2121	\N	\N	\N	t	f
2175	WOD	CROSSFIT	2025-03-31 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2176	WOD	CROSSFIT	2025-04-07 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2177	WOD	CROSSFIT	2025-04-14 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2178	WOD	CROSSFIT	2025-04-21 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2179	WOD	CROSSFIT	2025-04-28 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2180	WOD	CROSSFIT	2025-05-05 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2181	WOD	CROSSFIT	2025-05-12 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2182	WOD	CROSSFIT	2025-05-19 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2183	WOD	CROSSFIT	2025-05-26 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2184	WOD	CROSSFIT	2025-06-02 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2185	WOD	CROSSFIT	2025-06-09 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2186	WOD	CROSSFIT	2025-06-16 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2187	WOD	CROSSFIT	2025-06-23 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2188	WOD	CROSSFIT	2025-06-30 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2189	WOD	CROSSFIT	2025-07-07 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2190	WOD	CROSSFIT	2025-07-14 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2191	WOD	CROSSFIT	2025-07-21 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2192	WOD	CROSSFIT	2025-07-28 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2193	WOD	CROSSFIT	2025-08-04 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2194	WOD	CROSSFIT	2025-08-11 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2195	WOD	CROSSFIT	2025-08-18 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2196	WOD	CROSSFIT	2025-08-25 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2197	WOD	CROSSFIT	2025-09-01 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2198	WOD	CROSSFIT	2025-09-08 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2199	WOD	CROSSFIT	2025-09-15 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2200	WOD	CROSSFIT	2025-09-22 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2201	WOD	CROSSFIT	2025-09-29 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2202	WOD	CROSSFIT	2025-10-06 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2203	WOD	CROSSFIT	2025-10-13 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2204	WOD	CROSSFIT	2025-10-20 09:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2205	WOD	CROSSFIT	2025-10-27 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2206	WOD	CROSSFIT	2025-11-03 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2207	WOD	CROSSFIT	2025-11-10 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2208	WOD	CROSSFIT	2025-11-17 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2209	WOD	CROSSFIT	2025-11-24 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2210	WOD	CROSSFIT	2025-12-01 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2211	WOD	CROSSFIT	2025-12-08 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2212	WOD	CROSSFIT	2025-12-15 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2213	WOD	CROSSFIT	2025-12-22 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2214	WOD	CROSSFIT	2025-12-29 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2215	WOD	CROSSFIT	2026-01-05 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2216	WOD	CROSSFIT	2026-01-12 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2217	WOD	CROSSFIT	2026-01-19 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2218	WOD	CROSSFIT	2026-01-26 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2219	WOD	CROSSFIT	2026-02-02 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2220	WOD	CROSSFIT	2026-02-09 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2221	WOD	CROSSFIT	2026-02-16 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2222	WOD	CROSSFIT	2026-02-23 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2223	WOD	CROSSFIT	2026-03-02 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2224	WOD	CROSSFIT	2026-03-09 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2225	WOD	CROSSFIT	2026-03-16 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2226	WOD	CROSSFIT	2026-03-23 10:18:00	60	Karl Sasi	14	Must saal	t	2	2	2174	\N	\N	\N	t	f
2227	WOD	CROSSFIT	2025-03-24 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2228	WOD	CROSSFIT	2025-03-31 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2229	WOD	CROSSFIT	2025-04-07 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2230	WOD	CROSSFIT	2025-04-14 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2231	WOD	CROSSFIT	2025-04-21 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2232	WOD	CROSSFIT	2025-04-28 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2233	WOD	CROSSFIT	2025-05-05 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2234	WOD	CROSSFIT	2025-05-12 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2235	WOD	CROSSFIT	2025-05-19 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2236	WOD	CROSSFIT	2025-05-26 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2237	WOD	CROSSFIT	2025-06-02 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2238	WOD	CROSSFIT	2025-06-09 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2239	WOD	CROSSFIT	2025-06-16 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2240	WOD	CROSSFIT	2025-06-23 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2241	WOD	CROSSFIT	2025-06-30 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2242	WOD	CROSSFIT	2025-07-07 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2243	WOD	CROSSFIT	2025-07-14 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2244	WOD	CROSSFIT	2025-07-21 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2245	WOD	CROSSFIT	2025-07-28 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2246	WOD	CROSSFIT	2025-08-04 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2247	WOD	CROSSFIT	2025-08-11 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2248	WOD	CROSSFIT	2025-08-18 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2249	WOD	CROSSFIT	2025-08-25 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2250	WOD	CROSSFIT	2025-09-01 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2251	WOD	CROSSFIT	2025-09-08 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2252	WOD	CROSSFIT	2025-09-15 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2253	WOD	CROSSFIT	2025-09-22 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2254	WOD	CROSSFIT	2025-09-29 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2255	WOD	CROSSFIT	2025-10-06 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2256	WOD	CROSSFIT	2025-10-13 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2257	WOD	CROSSFIT	2025-10-20 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2258	WOD	CROSSFIT	2025-10-27 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2259	WOD	CROSSFIT	2025-11-03 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2260	WOD	CROSSFIT	2025-11-10 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2261	WOD	CROSSFIT	2025-11-17 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2262	WOD	CROSSFIT	2025-11-24 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2263	WOD	CROSSFIT	2025-12-01 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2264	WOD	CROSSFIT	2025-12-08 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2265	WOD	CROSSFIT	2025-12-15 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2266	WOD	CROSSFIT	2025-12-22 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2267	WOD	CROSSFIT	2025-12-29 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2268	WOD	CROSSFIT	2026-01-05 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2269	WOD	CROSSFIT	2026-01-12 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2270	WOD	CROSSFIT	2026-01-19 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2271	WOD	CROSSFIT	2026-01-26 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2272	WOD	CROSSFIT	2026-02-02 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2273	WOD	CROSSFIT	2026-02-09 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2274	WOD	CROSSFIT	2026-02-16 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2275	WOD	CROSSFIT	2026-02-23 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2276	WOD	CROSSFIT	2026-03-02 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2277	WOD	CROSSFIT	2026-03-09 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2278	WOD	CROSSFIT	2026-03-16 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2279	WOD	CROSSFIT	2026-03-23 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2227	\N	\N	\N	t	f
2280	WOD	CROSSFIT	2025-03-24 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2281	WOD	CROSSFIT	2025-03-31 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2282	WOD	CROSSFIT	2025-04-07 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2283	WOD	CROSSFIT	2025-04-14 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2284	WOD	CROSSFIT	2025-04-21 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2285	WOD	CROSSFIT	2025-04-28 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2286	WOD	CROSSFIT	2025-05-05 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2287	WOD	CROSSFIT	2025-05-12 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2288	WOD	CROSSFIT	2025-05-19 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2289	WOD	CROSSFIT	2025-05-26 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2290	WOD	CROSSFIT	2025-06-02 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2291	WOD	CROSSFIT	2025-06-09 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2292	WOD	CROSSFIT	2025-06-16 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2293	WOD	CROSSFIT	2025-06-23 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2294	WOD	CROSSFIT	2025-06-30 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2295	WOD	CROSSFIT	2025-07-07 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2296	WOD	CROSSFIT	2025-07-14 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2297	WOD	CROSSFIT	2025-07-21 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2298	WOD	CROSSFIT	2025-07-28 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2299	WOD	CROSSFIT	2025-08-04 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2300	WOD	CROSSFIT	2025-08-11 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2301	WOD	CROSSFIT	2025-08-18 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2302	WOD	CROSSFIT	2025-08-25 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2303	WOD	CROSSFIT	2025-09-01 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2304	WOD	CROSSFIT	2025-09-08 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2305	WOD	CROSSFIT	2025-09-15 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2306	WOD	CROSSFIT	2025-09-22 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2307	WOD	CROSSFIT	2025-09-29 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2308	WOD	CROSSFIT	2025-10-06 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2309	WOD	CROSSFIT	2025-10-13 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2310	WOD	CROSSFIT	2025-10-20 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2311	WOD	CROSSFIT	2025-10-27 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2312	WOD	CROSSFIT	2025-11-03 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2313	WOD	CROSSFIT	2025-11-10 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2314	WOD	CROSSFIT	2025-11-17 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2315	WOD	CROSSFIT	2025-11-24 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2316	WOD	CROSSFIT	2025-12-01 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2317	WOD	CROSSFIT	2025-12-08 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2318	WOD	CROSSFIT	2025-12-15 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2319	WOD	CROSSFIT	2025-12-22 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2320	WOD	CROSSFIT	2025-12-29 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2321	WOD	CROSSFIT	2026-01-05 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2322	WOD	CROSSFIT	2026-01-12 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2323	WOD	CROSSFIT	2026-01-19 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2324	WOD	CROSSFIT	2026-01-26 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2325	WOD	CROSSFIT	2026-02-02 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2326	WOD	CROSSFIT	2026-02-09 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2327	WOD	CROSSFIT	2026-02-16 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2328	WOD	CROSSFIT	2026-02-23 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2329	WOD	CROSSFIT	2026-03-02 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2330	WOD	CROSSFIT	2026-03-09 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2331	WOD	CROSSFIT	2026-03-16 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2332	WOD	CROSSFIT	2026-03-23 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2280	\N	\N	\N	t	f
2333	WOD	CROSSFIT	2025-03-24 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2334	WOD	CROSSFIT	2025-03-31 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2335	WOD	CROSSFIT	2025-04-07 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2336	WOD	CROSSFIT	2025-04-14 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2337	WOD	CROSSFIT	2025-04-21 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2338	WOD	CROSSFIT	2025-04-28 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2339	WOD	CROSSFIT	2025-05-05 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2340	WOD	CROSSFIT	2025-05-12 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2341	WOD	CROSSFIT	2025-05-19 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2342	WOD	CROSSFIT	2025-05-26 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2343	WOD	CROSSFIT	2025-06-02 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2344	WOD	CROSSFIT	2025-06-09 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2345	WOD	CROSSFIT	2025-06-16 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2346	WOD	CROSSFIT	2025-06-23 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2347	WOD	CROSSFIT	2025-06-30 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2348	WOD	CROSSFIT	2025-07-07 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2349	WOD	CROSSFIT	2025-07-14 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2350	WOD	CROSSFIT	2025-07-21 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2351	WOD	CROSSFIT	2025-07-28 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2352	WOD	CROSSFIT	2025-08-04 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2353	WOD	CROSSFIT	2025-08-11 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2354	WOD	CROSSFIT	2025-08-18 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2355	WOD	CROSSFIT	2025-08-25 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2356	WOD	CROSSFIT	2025-09-01 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2357	WOD	CROSSFIT	2025-09-08 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2358	WOD	CROSSFIT	2025-09-15 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2359	WOD	CROSSFIT	2025-09-22 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2360	WOD	CROSSFIT	2025-09-29 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2361	WOD	CROSSFIT	2025-10-06 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2362	WOD	CROSSFIT	2025-10-13 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2363	WOD	CROSSFIT	2025-10-20 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2364	WOD	CROSSFIT	2025-10-27 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2365	WOD	CROSSFIT	2025-11-03 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2366	WOD	CROSSFIT	2025-11-10 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2367	WOD	CROSSFIT	2025-11-17 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2368	WOD	CROSSFIT	2025-11-24 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2369	WOD	CROSSFIT	2025-12-01 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2370	WOD	CROSSFIT	2025-12-08 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2371	WOD	CROSSFIT	2025-12-15 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2372	WOD	CROSSFIT	2025-12-22 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2373	WOD	CROSSFIT	2025-12-29 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2374	WOD	CROSSFIT	2026-01-05 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2375	WOD	CROSSFIT	2026-01-12 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2376	WOD	CROSSFIT	2026-01-19 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2377	WOD	CROSSFIT	2026-01-26 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2378	WOD	CROSSFIT	2026-02-02 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2379	WOD	CROSSFIT	2026-02-09 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2380	WOD	CROSSFIT	2026-02-16 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2381	WOD	CROSSFIT	2026-02-23 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2382	WOD	CROSSFIT	2026-03-02 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2383	WOD	CROSSFIT	2026-03-09 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2384	WOD	CROSSFIT	2026-03-16 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
2385	WOD	CROSSFIT	2026-03-23 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2333	\N	\N	\N	t	f
3211	WOD	CROSSFIT	2025-10-24 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3212	WOD	CROSSFIT	2025-10-31 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3213	WOD	CROSSFIT	2025-11-07 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3214	WOD	CROSSFIT	2025-11-14 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3215	WOD	CROSSFIT	2025-11-21 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3216	WOD	CROSSFIT	2025-11-28 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3217	WOD	CROSSFIT	2025-12-05 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3218	WOD	CROSSFIT	2025-12-12 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3219	WOD	CROSSFIT	2025-12-19 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3220	WOD	CROSSFIT	2025-12-26 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3221	WOD	CROSSFIT	2026-01-02 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3222	WOD	CROSSFIT	2026-01-09 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3223	WOD	CROSSFIT	2026-01-16 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3224	WOD	CROSSFIT	2026-01-23 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3225	WOD	CROSSFIT	2026-01-30 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3226	WOD	CROSSFIT	2026-02-06 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3227	WOD	CROSSFIT	2026-02-13 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3228	WOD	CROSSFIT	2026-02-20 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3229	WOD	CROSSFIT	2026-02-27 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3230	WOD	CROSSFIT	2026-03-06 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3231	WOD	CROSSFIT	2026-03-13 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3232	WOD	CROSSFIT	2026-03-20 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
2386	WOD	CROSSFIT	2025-03-25 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2387	WOD	CROSSFIT	2025-04-01 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2388	WOD	CROSSFIT	2025-04-08 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2389	WOD	CROSSFIT	2025-04-15 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2390	WOD	CROSSFIT	2025-04-22 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2391	WOD	CROSSFIT	2025-04-29 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2392	WOD	CROSSFIT	2025-05-06 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2393	WOD	CROSSFIT	2025-05-13 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2394	WOD	CROSSFIT	2025-05-20 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2395	WOD	CROSSFIT	2025-05-27 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2396	WOD	CROSSFIT	2025-06-03 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2397	WOD	CROSSFIT	2025-06-10 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2398	WOD	CROSSFIT	2025-06-17 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2399	WOD	CROSSFIT	2025-06-24 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2400	WOD	CROSSFIT	2025-07-01 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2401	WOD	CROSSFIT	2025-07-08 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2402	WOD	CROSSFIT	2025-07-15 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2403	WOD	CROSSFIT	2025-07-22 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2404	WOD	CROSSFIT	2025-07-29 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2405	WOD	CROSSFIT	2025-08-05 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2406	WOD	CROSSFIT	2025-08-12 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2407	WOD	CROSSFIT	2025-08-19 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2408	WOD	CROSSFIT	2025-08-26 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2409	WOD	CROSSFIT	2025-09-02 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2410	WOD	CROSSFIT	2025-09-09 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2411	WOD	CROSSFIT	2025-09-16 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2412	WOD	CROSSFIT	2025-09-23 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2413	WOD	CROSSFIT	2025-09-30 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2414	WOD	CROSSFIT	2025-10-07 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2415	WOD	CROSSFIT	2025-10-14 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2416	WOD	CROSSFIT	2025-10-21 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2417	WOD	CROSSFIT	2025-10-28 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2418	WOD	CROSSFIT	2025-11-04 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2419	WOD	CROSSFIT	2025-11-11 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2420	WOD	CROSSFIT	2025-11-18 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2421	WOD	CROSSFIT	2025-11-25 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2422	WOD	CROSSFIT	2025-12-02 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2423	WOD	CROSSFIT	2025-12-09 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2424	WOD	CROSSFIT	2025-12-16 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2425	WOD	CROSSFIT	2025-12-23 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2426	WOD	CROSSFIT	2025-12-30 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2427	WOD	CROSSFIT	2026-01-06 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2428	WOD	CROSSFIT	2026-01-13 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2429	WOD	CROSSFIT	2026-01-20 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2430	WOD	CROSSFIT	2026-01-27 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2431	WOD	CROSSFIT	2026-02-03 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2432	WOD	CROSSFIT	2026-02-10 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2433	WOD	CROSSFIT	2026-02-17 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2434	WOD	CROSSFIT	2026-02-24 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2435	WOD	CROSSFIT	2026-03-03 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2436	WOD	CROSSFIT	2026-03-10 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2437	WOD	CROSSFIT	2026-03-17 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2438	WOD	CROSSFIT	2026-03-24 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2386	\N	\N	\N	t	f
2439	WOD	CROSSFIT	2025-03-25 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2440	WOD	CROSSFIT	2025-04-01 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2441	WOD	CROSSFIT	2025-04-08 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2442	WOD	CROSSFIT	2025-04-15 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2443	WOD	CROSSFIT	2025-04-22 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2444	WOD	CROSSFIT	2025-04-29 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2445	WOD	CROSSFIT	2025-05-06 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2446	WOD	CROSSFIT	2025-05-13 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2447	WOD	CROSSFIT	2025-05-20 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2448	WOD	CROSSFIT	2025-05-27 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2449	WOD	CROSSFIT	2025-06-03 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2450	WOD	CROSSFIT	2025-06-10 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2451	WOD	CROSSFIT	2025-06-17 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2452	WOD	CROSSFIT	2025-06-24 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2453	WOD	CROSSFIT	2025-07-01 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2454	WOD	CROSSFIT	2025-07-08 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2455	WOD	CROSSFIT	2025-07-15 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2456	WOD	CROSSFIT	2025-07-22 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2457	WOD	CROSSFIT	2025-07-29 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2458	WOD	CROSSFIT	2025-08-05 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2459	WOD	CROSSFIT	2025-08-12 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2460	WOD	CROSSFIT	2025-08-19 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2461	WOD	CROSSFIT	2025-08-26 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2462	WOD	CROSSFIT	2025-09-02 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2463	WOD	CROSSFIT	2025-09-09 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2464	WOD	CROSSFIT	2025-09-16 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2465	WOD	CROSSFIT	2025-09-23 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2466	WOD	CROSSFIT	2025-09-30 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2467	WOD	CROSSFIT	2025-10-07 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2468	WOD	CROSSFIT	2025-10-14 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2469	WOD	CROSSFIT	2025-10-21 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2470	WOD	CROSSFIT	2025-10-28 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2471	WOD	CROSSFIT	2025-11-04 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2472	WOD	CROSSFIT	2025-11-11 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2473	WOD	CROSSFIT	2025-11-18 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2474	WOD	CROSSFIT	2025-11-25 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2475	WOD	CROSSFIT	2025-12-02 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2476	WOD	CROSSFIT	2025-12-09 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2477	WOD	CROSSFIT	2025-12-16 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2478	WOD	CROSSFIT	2025-12-23 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2479	WOD	CROSSFIT	2025-12-30 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2480	WOD	CROSSFIT	2026-01-06 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2481	WOD	CROSSFIT	2026-01-13 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2482	WOD	CROSSFIT	2026-01-20 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2483	WOD	CROSSFIT	2026-01-27 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2484	WOD	CROSSFIT	2026-02-03 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2485	WOD	CROSSFIT	2026-02-10 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2486	WOD	CROSSFIT	2026-02-17 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2487	WOD	CROSSFIT	2026-02-24 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2488	WOD	CROSSFIT	2026-03-03 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2489	WOD	CROSSFIT	2026-03-10 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2490	WOD	CROSSFIT	2026-03-17 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2491	WOD	CROSSFIT	2026-03-24 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2439	\N	\N	\N	t	f
2492	WOD	CROSSFIT	2025-03-25 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2493	WOD	CROSSFIT	2025-04-01 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2494	WOD	CROSSFIT	2025-04-08 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2495	WOD	CROSSFIT	2025-04-15 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2496	WOD	CROSSFIT	2025-04-22 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2497	WOD	CROSSFIT	2025-04-29 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2498	WOD	CROSSFIT	2025-05-06 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2499	WOD	CROSSFIT	2025-05-13 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2500	WOD	CROSSFIT	2025-05-20 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2501	WOD	CROSSFIT	2025-05-27 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2502	WOD	CROSSFIT	2025-06-03 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2503	WOD	CROSSFIT	2025-06-10 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2504	WOD	CROSSFIT	2025-06-17 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2505	WOD	CROSSFIT	2025-06-24 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2506	WOD	CROSSFIT	2025-07-01 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2507	WOD	CROSSFIT	2025-07-08 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2508	WOD	CROSSFIT	2025-07-15 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2509	WOD	CROSSFIT	2025-07-22 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2510	WOD	CROSSFIT	2025-07-29 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2511	WOD	CROSSFIT	2025-08-05 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2512	WOD	CROSSFIT	2025-08-12 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2513	WOD	CROSSFIT	2025-08-19 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2514	WOD	CROSSFIT	2025-08-26 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2515	WOD	CROSSFIT	2025-09-02 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2516	WOD	CROSSFIT	2025-09-09 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2517	WOD	CROSSFIT	2025-09-16 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2518	WOD	CROSSFIT	2025-09-23 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2519	WOD	CROSSFIT	2025-09-30 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2520	WOD	CROSSFIT	2025-10-07 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2521	WOD	CROSSFIT	2025-10-14 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2522	WOD	CROSSFIT	2025-10-21 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2523	WOD	CROSSFIT	2025-10-28 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2524	WOD	CROSSFIT	2025-11-04 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2525	WOD	CROSSFIT	2025-11-11 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2526	WOD	CROSSFIT	2025-11-18 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2527	WOD	CROSSFIT	2025-11-25 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2528	WOD	CROSSFIT	2025-12-02 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2529	WOD	CROSSFIT	2025-12-09 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2530	WOD	CROSSFIT	2025-12-16 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2531	WOD	CROSSFIT	2025-12-23 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2532	WOD	CROSSFIT	2025-12-30 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2533	WOD	CROSSFIT	2026-01-06 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2534	WOD	CROSSFIT	2026-01-13 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2535	WOD	CROSSFIT	2026-01-20 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2536	WOD	CROSSFIT	2026-01-27 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2537	WOD	CROSSFIT	2026-02-03 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2538	WOD	CROSSFIT	2026-02-10 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2539	WOD	CROSSFIT	2026-02-17 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2540	WOD	CROSSFIT	2026-02-24 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2541	WOD	CROSSFIT	2026-03-03 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2542	WOD	CROSSFIT	2026-03-10 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2543	WOD	CROSSFIT	2026-03-17 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2544	WOD	CROSSFIT	2026-03-24 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2492	\N	\N	\N	t	f
2545	WOD	CROSSFIT	2025-03-25 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2546	WOD	CROSSFIT	2025-04-01 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2547	WOD	CROSSFIT	2025-04-08 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2548	WOD	CROSSFIT	2025-04-15 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2549	WOD	CROSSFIT	2025-04-22 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2550	WOD	CROSSFIT	2025-04-29 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2551	WOD	CROSSFIT	2025-05-06 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2552	WOD	CROSSFIT	2025-05-13 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2553	WOD	CROSSFIT	2025-05-20 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2554	WOD	CROSSFIT	2025-05-27 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2555	WOD	CROSSFIT	2025-06-03 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2556	WOD	CROSSFIT	2025-06-10 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2557	WOD	CROSSFIT	2025-06-17 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2558	WOD	CROSSFIT	2025-06-24 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2559	WOD	CROSSFIT	2025-07-01 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2560	WOD	CROSSFIT	2025-07-08 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2561	WOD	CROSSFIT	2025-07-15 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2562	WOD	CROSSFIT	2025-07-22 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2563	WOD	CROSSFIT	2025-07-29 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2564	WOD	CROSSFIT	2025-08-05 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2565	WOD	CROSSFIT	2025-08-12 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2566	WOD	CROSSFIT	2025-08-19 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2567	WOD	CROSSFIT	2025-08-26 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2568	WOD	CROSSFIT	2025-09-02 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2569	WOD	CROSSFIT	2025-09-09 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2570	WOD	CROSSFIT	2025-09-16 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2571	WOD	CROSSFIT	2025-09-23 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2572	WOD	CROSSFIT	2025-09-30 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2573	WOD	CROSSFIT	2025-10-07 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2574	WOD	CROSSFIT	2025-10-14 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2575	WOD	CROSSFIT	2025-10-21 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2576	WOD	CROSSFIT	2025-10-28 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2577	WOD	CROSSFIT	2025-11-04 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2578	WOD	CROSSFIT	2025-11-11 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2579	WOD	CROSSFIT	2025-11-18 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2580	WOD	CROSSFIT	2025-11-25 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2581	WOD	CROSSFIT	2025-12-02 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2582	WOD	CROSSFIT	2025-12-09 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2583	WOD	CROSSFIT	2025-12-16 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2584	WOD	CROSSFIT	2025-12-23 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2585	WOD	CROSSFIT	2025-12-30 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2586	WOD	CROSSFIT	2026-01-06 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2587	WOD	CROSSFIT	2026-01-13 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2588	WOD	CROSSFIT	2026-01-20 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2589	WOD	CROSSFIT	2026-01-27 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2590	WOD	CROSSFIT	2026-02-03 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2591	WOD	CROSSFIT	2026-02-10 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2592	WOD	CROSSFIT	2026-02-17 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2593	WOD	CROSSFIT	2026-02-24 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2594	WOD	CROSSFIT	2026-03-03 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2595	WOD	CROSSFIT	2026-03-10 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2596	WOD	CROSSFIT	2026-03-17 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2597	WOD	CROSSFIT	2026-03-24 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2545	\N	\N	\N	t	f
2598	WOD	CROSSFIT	2025-03-26 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2599	WOD	CROSSFIT	2025-04-02 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2600	WOD	CROSSFIT	2025-04-09 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2601	WOD	CROSSFIT	2025-04-16 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2602	WOD	CROSSFIT	2025-04-23 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2603	WOD	CROSSFIT	2025-04-30 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2604	WOD	CROSSFIT	2025-05-07 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2605	WOD	CROSSFIT	2025-05-14 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2606	WOD	CROSSFIT	2025-05-21 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2607	WOD	CROSSFIT	2025-05-28 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2608	WOD	CROSSFIT	2025-06-04 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2609	WOD	CROSSFIT	2025-06-11 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2610	WOD	CROSSFIT	2025-06-18 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2611	WOD	CROSSFIT	2025-06-25 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2612	WOD	CROSSFIT	2025-07-02 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2613	WOD	CROSSFIT	2025-07-09 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2614	WOD	CROSSFIT	2025-07-16 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2615	WOD	CROSSFIT	2025-07-23 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2616	WOD	CROSSFIT	2025-07-30 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2617	WOD	CROSSFIT	2025-08-06 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2618	WOD	CROSSFIT	2025-08-13 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2619	WOD	CROSSFIT	2025-08-20 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2620	WOD	CROSSFIT	2025-08-27 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2621	WOD	CROSSFIT	2025-09-03 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2622	WOD	CROSSFIT	2025-09-10 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2623	WOD	CROSSFIT	2025-09-17 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2624	WOD	CROSSFIT	2025-09-24 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2625	WOD	CROSSFIT	2025-10-01 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2626	WOD	CROSSFIT	2025-10-08 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2627	WOD	CROSSFIT	2025-10-15 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2628	WOD	CROSSFIT	2025-10-22 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2629	WOD	CROSSFIT	2025-10-29 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2630	WOD	CROSSFIT	2025-11-05 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2631	WOD	CROSSFIT	2025-11-12 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2632	WOD	CROSSFIT	2025-11-19 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2633	WOD	CROSSFIT	2025-11-26 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2634	WOD	CROSSFIT	2025-12-03 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2635	WOD	CROSSFIT	2025-12-10 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2636	WOD	CROSSFIT	2025-12-17 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2637	WOD	CROSSFIT	2025-12-24 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2638	WOD	CROSSFIT	2025-12-31 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2639	WOD	CROSSFIT	2026-01-07 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2640	WOD	CROSSFIT	2026-01-14 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2641	WOD	CROSSFIT	2026-01-21 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2642	WOD	CROSSFIT	2026-01-28 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2643	WOD	CROSSFIT	2026-02-04 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2644	WOD	CROSSFIT	2026-02-11 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2645	WOD	CROSSFIT	2026-02-18 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2646	WOD	CROSSFIT	2026-02-25 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2647	WOD	CROSSFIT	2026-03-04 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2648	WOD	CROSSFIT	2026-03-11 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2649	WOD	CROSSFIT	2026-03-18 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2650	WOD	CROSSFIT	2026-03-25 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2598	\N	\N	\N	t	f
2651	WOD	CROSSFIT	2025-03-26 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2652	WOD	CROSSFIT	2025-04-02 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2653	WOD	CROSSFIT	2025-04-09 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2654	WOD	CROSSFIT	2025-04-16 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2655	WOD	CROSSFIT	2025-04-23 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2656	WOD	CROSSFIT	2025-04-30 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2657	WOD	CROSSFIT	2025-05-07 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2658	WOD	CROSSFIT	2025-05-14 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2659	WOD	CROSSFIT	2025-05-21 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2660	WOD	CROSSFIT	2025-05-28 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2661	WOD	CROSSFIT	2025-06-04 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2662	WOD	CROSSFIT	2025-06-11 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2663	WOD	CROSSFIT	2025-06-18 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2664	WOD	CROSSFIT	2025-06-25 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2665	WOD	CROSSFIT	2025-07-02 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2666	WOD	CROSSFIT	2025-07-09 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2667	WOD	CROSSFIT	2025-07-16 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2668	WOD	CROSSFIT	2025-07-23 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2669	WOD	CROSSFIT	2025-07-30 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2670	WOD	CROSSFIT	2025-08-06 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2671	WOD	CROSSFIT	2025-08-13 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2672	WOD	CROSSFIT	2025-08-20 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2673	WOD	CROSSFIT	2025-08-27 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2674	WOD	CROSSFIT	2025-09-03 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2675	WOD	CROSSFIT	2025-09-10 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2676	WOD	CROSSFIT	2025-09-17 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2677	WOD	CROSSFIT	2025-09-24 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2678	WOD	CROSSFIT	2025-10-01 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2679	WOD	CROSSFIT	2025-10-08 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2680	WOD	CROSSFIT	2025-10-15 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2681	WOD	CROSSFIT	2025-10-22 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2682	WOD	CROSSFIT	2025-10-29 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2683	WOD	CROSSFIT	2025-11-05 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2684	WOD	CROSSFIT	2025-11-12 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2685	WOD	CROSSFIT	2025-11-19 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2686	WOD	CROSSFIT	2025-11-26 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2687	WOD	CROSSFIT	2025-12-03 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2688	WOD	CROSSFIT	2025-12-10 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2689	WOD	CROSSFIT	2025-12-17 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2690	WOD	CROSSFIT	2025-12-24 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2691	WOD	CROSSFIT	2025-12-31 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2692	WOD	CROSSFIT	2026-01-07 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2693	WOD	CROSSFIT	2026-01-14 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2694	WOD	CROSSFIT	2026-01-21 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2695	WOD	CROSSFIT	2026-01-28 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2696	WOD	CROSSFIT	2026-02-04 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2697	WOD	CROSSFIT	2026-02-11 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2698	WOD	CROSSFIT	2026-02-18 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2699	WOD	CROSSFIT	2026-02-25 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2700	WOD	CROSSFIT	2026-03-04 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2701	WOD	CROSSFIT	2026-03-11 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2702	WOD	CROSSFIT	2026-03-18 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2703	WOD	CROSSFIT	2026-03-25 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2651	\N	\N	\N	t	f
2757	WOD	CROSSFIT	2025-03-26 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2758	WOD	CROSSFIT	2025-04-02 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2759	WOD	CROSSFIT	2025-04-09 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2760	WOD	CROSSFIT	2025-04-16 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2761	WOD	CROSSFIT	2025-04-23 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2762	WOD	CROSSFIT	2025-04-30 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2763	WOD	CROSSFIT	2025-05-07 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2764	WOD	CROSSFIT	2025-05-14 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2765	WOD	CROSSFIT	2025-05-21 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2766	WOD	CROSSFIT	2025-05-28 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2767	WOD	CROSSFIT	2025-06-04 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2768	WOD	CROSSFIT	2025-06-11 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2769	WOD	CROSSFIT	2025-06-18 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2770	WOD	CROSSFIT	2025-06-25 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2771	WOD	CROSSFIT	2025-07-02 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2772	WOD	CROSSFIT	2025-07-09 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2773	WOD	CROSSFIT	2025-07-16 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2774	WOD	CROSSFIT	2025-07-23 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2775	WOD	CROSSFIT	2025-07-30 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2776	WOD	CROSSFIT	2025-08-06 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2777	WOD	CROSSFIT	2025-08-13 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2778	WOD	CROSSFIT	2025-08-20 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2779	WOD	CROSSFIT	2025-08-27 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2780	WOD	CROSSFIT	2025-09-03 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2781	WOD	CROSSFIT	2025-09-10 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2782	WOD	CROSSFIT	2025-09-17 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2783	WOD	CROSSFIT	2025-09-24 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2784	WOD	CROSSFIT	2025-10-01 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2785	WOD	CROSSFIT	2025-10-08 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2786	WOD	CROSSFIT	2025-10-15 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2787	WOD	CROSSFIT	2025-10-22 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2788	WOD	CROSSFIT	2025-10-29 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2704	WOD	CROSSFIT	2025-03-26 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2705	WOD	CROSSFIT	2025-04-02 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2706	WOD	CROSSFIT	2025-04-09 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2707	WOD	CROSSFIT	2025-04-16 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2708	WOD	CROSSFIT	2025-04-23 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2709	WOD	CROSSFIT	2025-04-30 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2710	WOD	CROSSFIT	2025-05-07 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2711	WOD	CROSSFIT	2025-05-14 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2712	WOD	CROSSFIT	2025-05-21 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2713	WOD	CROSSFIT	2025-05-28 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2714	WOD	CROSSFIT	2025-06-04 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2715	WOD	CROSSFIT	2025-06-11 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2716	WOD	CROSSFIT	2025-06-18 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2717	WOD	CROSSFIT	2025-06-25 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2718	WOD	CROSSFIT	2025-07-02 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2719	WOD	CROSSFIT	2025-07-09 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2720	WOD	CROSSFIT	2025-07-16 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2721	WOD	CROSSFIT	2025-07-23 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2722	WOD	CROSSFIT	2025-07-30 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2723	WOD	CROSSFIT	2025-08-06 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2724	WOD	CROSSFIT	2025-08-13 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2725	WOD	CROSSFIT	2025-08-20 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2726	WOD	CROSSFIT	2025-08-27 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2727	WOD	CROSSFIT	2025-09-03 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2728	WOD	CROSSFIT	2025-09-10 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2729	WOD	CROSSFIT	2025-09-17 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2730	WOD	CROSSFIT	2025-09-24 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2731	WOD	CROSSFIT	2025-10-01 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2732	WOD	CROSSFIT	2025-10-08 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2733	WOD	CROSSFIT	2025-10-15 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2734	WOD	CROSSFIT	2025-10-22 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2735	WOD	CROSSFIT	2025-10-29 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2736	WOD	CROSSFIT	2025-11-05 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2737	WOD	CROSSFIT	2025-11-12 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2738	WOD	CROSSFIT	2025-11-19 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2739	WOD	CROSSFIT	2025-11-26 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2740	WOD	CROSSFIT	2025-12-03 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2741	WOD	CROSSFIT	2025-12-10 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2742	WOD	CROSSFIT	2025-12-17 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2743	WOD	CROSSFIT	2025-12-24 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2744	WOD	CROSSFIT	2025-12-31 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2745	WOD	CROSSFIT	2026-01-07 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2746	WOD	CROSSFIT	2026-01-14 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2747	WOD	CROSSFIT	2026-01-21 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2748	WOD	CROSSFIT	2026-01-28 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2749	WOD	CROSSFIT	2026-02-04 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2750	WOD	CROSSFIT	2026-02-11 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2751	WOD	CROSSFIT	2026-02-18 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2752	WOD	CROSSFIT	2026-02-25 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2753	WOD	CROSSFIT	2026-03-04 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2754	WOD	CROSSFIT	2026-03-11 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2755	WOD	CROSSFIT	2026-03-18 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2756	WOD	CROSSFIT	2026-03-25 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2704	\N	\N	\N	t	f
2810	WOD	CROSSFIT	2025-03-27 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2811	WOD	CROSSFIT	2025-04-03 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2812	WOD	CROSSFIT	2025-04-10 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2813	WOD	CROSSFIT	2025-04-17 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2814	WOD	CROSSFIT	2025-04-24 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2815	WOD	CROSSFIT	2025-05-01 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2816	WOD	CROSSFIT	2025-05-08 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2817	WOD	CROSSFIT	2025-05-15 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2818	WOD	CROSSFIT	2025-05-22 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2819	WOD	CROSSFIT	2025-05-29 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2820	WOD	CROSSFIT	2025-06-05 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2821	WOD	CROSSFIT	2025-06-12 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2822	WOD	CROSSFIT	2025-06-19 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2823	WOD	CROSSFIT	2025-06-26 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2824	WOD	CROSSFIT	2025-07-03 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2825	WOD	CROSSFIT	2025-07-10 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2826	WOD	CROSSFIT	2025-07-17 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2789	WOD	CROSSFIT	2025-11-05 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2790	WOD	CROSSFIT	2025-11-12 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2791	WOD	CROSSFIT	2025-11-19 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2792	WOD	CROSSFIT	2025-11-26 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2793	WOD	CROSSFIT	2025-12-03 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2794	WOD	CROSSFIT	2025-12-10 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2795	WOD	CROSSFIT	2025-12-17 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2796	WOD	CROSSFIT	2025-12-24 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2797	WOD	CROSSFIT	2025-12-31 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2798	WOD	CROSSFIT	2026-01-07 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2799	WOD	CROSSFIT	2026-01-14 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2800	WOD	CROSSFIT	2026-01-21 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2801	WOD	CROSSFIT	2026-01-28 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2802	WOD	CROSSFIT	2026-02-04 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2803	WOD	CROSSFIT	2026-02-11 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2804	WOD	CROSSFIT	2026-02-18 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2805	WOD	CROSSFIT	2026-02-25 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2806	WOD	CROSSFIT	2026-03-04 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2807	WOD	CROSSFIT	2026-03-11 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2808	WOD	CROSSFIT	2026-03-18 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2809	WOD	CROSSFIT	2026-03-25 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2757	\N	\N	\N	t	f
2916	WOD	CROSSFIT	2025-03-27 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2917	WOD	CROSSFIT	2025-04-03 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2918	WOD	CROSSFIT	2025-04-10 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2919	WOD	CROSSFIT	2025-04-17 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2920	WOD	CROSSFIT	2025-04-24 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2921	WOD	CROSSFIT	2025-05-01 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2922	WOD	CROSSFIT	2025-05-08 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2923	WOD	CROSSFIT	2025-05-15 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2924	WOD	CROSSFIT	2025-05-22 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2925	WOD	CROSSFIT	2025-05-29 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2926	WOD	CROSSFIT	2025-06-05 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2927	WOD	CROSSFIT	2025-06-12 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2928	WOD	CROSSFIT	2025-06-19 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2929	WOD	CROSSFIT	2025-06-26 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2930	WOD	CROSSFIT	2025-07-03 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2931	WOD	CROSSFIT	2025-07-10 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2932	WOD	CROSSFIT	2025-07-17 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2933	WOD	CROSSFIT	2025-07-24 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2934	WOD	CROSSFIT	2025-07-31 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2935	WOD	CROSSFIT	2025-08-07 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2936	WOD	CROSSFIT	2025-08-14 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2937	WOD	CROSSFIT	2025-08-21 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2938	WOD	CROSSFIT	2025-08-28 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2939	WOD	CROSSFIT	2025-09-04 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2940	WOD	CROSSFIT	2025-09-11 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2941	WOD	CROSSFIT	2025-09-18 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2942	WOD	CROSSFIT	2025-09-25 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2943	WOD	CROSSFIT	2025-10-02 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2944	WOD	CROSSFIT	2025-10-09 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2945	WOD	CROSSFIT	2025-10-16 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2946	WOD	CROSSFIT	2025-10-23 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2947	WOD	CROSSFIT	2025-10-30 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2948	WOD	CROSSFIT	2025-11-06 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2949	WOD	CROSSFIT	2025-11-13 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2950	WOD	CROSSFIT	2025-11-20 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2951	WOD	CROSSFIT	2025-11-27 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2952	WOD	CROSSFIT	2025-12-04 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2953	WOD	CROSSFIT	2025-12-11 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2954	WOD	CROSSFIT	2025-12-18 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2955	WOD	CROSSFIT	2025-12-25 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2956	WOD	CROSSFIT	2026-01-01 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2957	WOD	CROSSFIT	2026-01-08 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2958	WOD	CROSSFIT	2026-01-15 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2959	WOD	CROSSFIT	2026-01-22 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2960	WOD	CROSSFIT	2026-01-29 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2961	WOD	CROSSFIT	2026-02-05 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2962	WOD	CROSSFIT	2026-02-12 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2963	WOD	CROSSFIT	2026-02-19 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2964	WOD	CROSSFIT	2026-02-26 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2827	WOD	CROSSFIT	2025-07-24 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2828	WOD	CROSSFIT	2025-07-31 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2829	WOD	CROSSFIT	2025-08-07 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2830	WOD	CROSSFIT	2025-08-14 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2831	WOD	CROSSFIT	2025-08-21 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2832	WOD	CROSSFIT	2025-08-28 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2833	WOD	CROSSFIT	2025-09-04 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2834	WOD	CROSSFIT	2025-09-11 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2835	WOD	CROSSFIT	2025-09-18 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2836	WOD	CROSSFIT	2025-09-25 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2837	WOD	CROSSFIT	2025-10-02 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2838	WOD	CROSSFIT	2025-10-09 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2839	WOD	CROSSFIT	2025-10-16 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2840	WOD	CROSSFIT	2025-10-23 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2841	WOD	CROSSFIT	2025-10-30 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2842	WOD	CROSSFIT	2025-11-06 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2843	WOD	CROSSFIT	2025-11-13 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2844	WOD	CROSSFIT	2025-11-20 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2845	WOD	CROSSFIT	2025-11-27 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2846	WOD	CROSSFIT	2025-12-04 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2847	WOD	CROSSFIT	2025-12-11 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2848	WOD	CROSSFIT	2025-12-18 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2849	WOD	CROSSFIT	2025-12-25 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2850	WOD	CROSSFIT	2026-01-01 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2851	WOD	CROSSFIT	2026-01-08 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2852	WOD	CROSSFIT	2026-01-15 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2853	WOD	CROSSFIT	2026-01-22 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2854	WOD	CROSSFIT	2026-01-29 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2855	WOD	CROSSFIT	2026-02-05 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2856	WOD	CROSSFIT	2026-02-12 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2857	WOD	CROSSFIT	2026-02-19 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2858	WOD	CROSSFIT	2026-02-26 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2859	WOD	CROSSFIT	2026-03-05 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2860	WOD	CROSSFIT	2026-03-12 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2861	WOD	CROSSFIT	2026-03-19 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2862	WOD	CROSSFIT	2026-03-26 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	2810	\N	\N	\N	t	f
2863	WOD	CROSSFIT	2025-03-27 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2864	WOD	CROSSFIT	2025-04-03 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2865	WOD	CROSSFIT	2025-04-10 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2866	WOD	CROSSFIT	2025-04-17 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2867	WOD	CROSSFIT	2025-04-24 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2868	WOD	CROSSFIT	2025-05-01 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2869	WOD	CROSSFIT	2025-05-08 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2870	WOD	CROSSFIT	2025-05-15 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2871	WOD	CROSSFIT	2025-05-22 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2872	WOD	CROSSFIT	2025-05-29 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2873	WOD	CROSSFIT	2025-06-05 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2874	WOD	CROSSFIT	2025-06-12 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2875	WOD	CROSSFIT	2025-06-19 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2876	WOD	CROSSFIT	2025-06-26 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2877	WOD	CROSSFIT	2025-07-03 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2878	WOD	CROSSFIT	2025-07-10 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2879	WOD	CROSSFIT	2025-07-17 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2880	WOD	CROSSFIT	2025-07-24 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2881	WOD	CROSSFIT	2025-07-31 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2882	WOD	CROSSFIT	2025-08-07 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2883	WOD	CROSSFIT	2025-08-14 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2884	WOD	CROSSFIT	2025-08-21 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2885	WOD	CROSSFIT	2025-08-28 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2886	WOD	CROSSFIT	2025-09-04 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2887	WOD	CROSSFIT	2025-09-11 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2888	WOD	CROSSFIT	2025-09-18 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2889	WOD	CROSSFIT	2025-09-25 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2890	WOD	CROSSFIT	2025-10-02 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2891	WOD	CROSSFIT	2025-10-09 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2892	WOD	CROSSFIT	2025-10-16 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2893	WOD	CROSSFIT	2025-10-23 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2894	WOD	CROSSFIT	2025-10-30 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2895	WOD	CROSSFIT	2025-11-06 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2896	WOD	CROSSFIT	2025-11-13 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2897	WOD	CROSSFIT	2025-11-20 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2898	WOD	CROSSFIT	2025-11-27 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2899	WOD	CROSSFIT	2025-12-04 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2900	WOD	CROSSFIT	2025-12-11 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2901	WOD	CROSSFIT	2025-12-18 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2902	WOD	CROSSFIT	2025-12-25 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2903	WOD	CROSSFIT	2026-01-01 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2904	WOD	CROSSFIT	2026-01-08 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2905	WOD	CROSSFIT	2026-01-15 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2906	WOD	CROSSFIT	2026-01-22 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2907	WOD	CROSSFIT	2026-01-29 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2908	WOD	CROSSFIT	2026-02-05 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2909	WOD	CROSSFIT	2026-02-12 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2910	WOD	CROSSFIT	2026-02-19 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2911	WOD	CROSSFIT	2026-02-26 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2912	WOD	CROSSFIT	2026-03-05 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2913	WOD	CROSSFIT	2026-03-12 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2914	WOD	CROSSFIT	2026-03-19 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2915	WOD	CROSSFIT	2026-03-26 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	2863	\N	\N	\N	t	f
2969	WOD	CROSSFIT	2025-03-27 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
2970	WOD	CROSSFIT	2025-04-03 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2971	WOD	CROSSFIT	2025-04-10 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2972	WOD	CROSSFIT	2025-04-17 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2973	WOD	CROSSFIT	2025-04-24 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2974	WOD	CROSSFIT	2025-05-01 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2975	WOD	CROSSFIT	2025-05-08 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2976	WOD	CROSSFIT	2025-05-15 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2977	WOD	CROSSFIT	2025-05-22 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2978	WOD	CROSSFIT	2025-05-29 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2979	WOD	CROSSFIT	2025-06-05 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2980	WOD	CROSSFIT	2025-06-12 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2981	WOD	CROSSFIT	2025-06-19 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2982	WOD	CROSSFIT	2025-06-26 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2983	WOD	CROSSFIT	2025-07-03 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2984	WOD	CROSSFIT	2025-07-10 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2985	WOD	CROSSFIT	2025-07-17 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2986	WOD	CROSSFIT	2025-07-24 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2987	WOD	CROSSFIT	2025-07-31 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2988	WOD	CROSSFIT	2025-08-07 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2989	WOD	CROSSFIT	2025-08-14 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2990	WOD	CROSSFIT	2025-08-21 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2991	WOD	CROSSFIT	2025-08-28 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2992	WOD	CROSSFIT	2025-09-04 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2993	WOD	CROSSFIT	2025-09-11 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2994	WOD	CROSSFIT	2025-09-18 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2995	WOD	CROSSFIT	2025-09-25 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2996	WOD	CROSSFIT	2025-10-02 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2997	WOD	CROSSFIT	2025-10-09 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2998	WOD	CROSSFIT	2025-10-16 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2999	WOD	CROSSFIT	2025-10-23 16:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3000	WOD	CROSSFIT	2025-10-30 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3001	WOD	CROSSFIT	2025-11-06 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3002	WOD	CROSSFIT	2025-11-13 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3003	WOD	CROSSFIT	2025-11-20 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3004	WOD	CROSSFIT	2025-11-27 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3005	WOD	CROSSFIT	2025-12-04 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3006	WOD	CROSSFIT	2025-12-11 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3007	WOD	CROSSFIT	2025-12-18 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3008	WOD	CROSSFIT	2025-12-25 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3009	WOD	CROSSFIT	2026-01-01 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3010	WOD	CROSSFIT	2026-01-08 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3011	WOD	CROSSFIT	2026-01-15 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3012	WOD	CROSSFIT	2026-01-22 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3013	WOD	CROSSFIT	2026-01-29 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3014	WOD	CROSSFIT	2026-02-05 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3015	WOD	CROSSFIT	2026-02-12 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3016	WOD	CROSSFIT	2026-02-19 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3017	WOD	CROSSFIT	2026-02-26 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3018	WOD	CROSSFIT	2026-03-05 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3019	WOD	CROSSFIT	2026-03-12 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
2965	WOD	CROSSFIT	2026-03-05 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2966	WOD	CROSSFIT	2026-03-12 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2967	WOD	CROSSFIT	2026-03-19 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
2968	WOD	CROSSFIT	2026-03-26 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	2916	\N	\N	\N	t	f
3233	WOD	CROSSFIT	2026-03-27 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	3181	\N	\N	\N	t	f
3234	WOD	CROSSFIT	2025-03-29 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
3235	WOD	CROSSFIT	2025-04-05 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3236	WOD	CROSSFIT	2025-04-12 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3237	WOD	CROSSFIT	2025-04-19 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3238	WOD	CROSSFIT	2025-04-26 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3239	WOD	CROSSFIT	2025-05-03 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3240	WOD	CROSSFIT	2025-05-10 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3241	WOD	CROSSFIT	2025-05-17 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3242	WOD	CROSSFIT	2025-05-24 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3243	WOD	CROSSFIT	2025-05-31 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3244	WOD	CROSSFIT	2025-06-07 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3245	WOD	CROSSFIT	2025-06-14 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3246	WOD	CROSSFIT	2025-06-21 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3247	WOD	CROSSFIT	2025-06-28 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3248	WOD	CROSSFIT	2025-07-05 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3249	WOD	CROSSFIT	2025-07-12 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3250	WOD	CROSSFIT	2025-07-19 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3251	WOD	CROSSFIT	2025-07-26 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3252	WOD	CROSSFIT	2025-08-02 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3253	WOD	CROSSFIT	2025-08-09 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3254	WOD	CROSSFIT	2025-08-16 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3255	WOD	CROSSFIT	2025-08-23 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3256	WOD	CROSSFIT	2025-08-30 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3257	WOD	CROSSFIT	2025-09-06 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3258	WOD	CROSSFIT	2025-09-13 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3259	WOD	CROSSFIT	2025-09-20 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3260	WOD	CROSSFIT	2025-09-27 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3261	WOD	CROSSFIT	2025-10-04 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3262	WOD	CROSSFIT	2025-10-11 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3263	WOD	CROSSFIT	2025-10-18 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3264	WOD	CROSSFIT	2025-10-25 07:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3265	WOD	CROSSFIT	2025-11-01 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3266	WOD	CROSSFIT	2025-11-08 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3267	WOD	CROSSFIT	2025-11-15 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3268	WOD	CROSSFIT	2025-11-22 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3269	WOD	CROSSFIT	2025-11-29 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3270	WOD	CROSSFIT	2025-12-06 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3271	WOD	CROSSFIT	2025-12-13 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3272	WOD	CROSSFIT	2025-12-20 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3273	WOD	CROSSFIT	2025-12-27 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3274	WOD	CROSSFIT	2026-01-03 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3275	WOD	CROSSFIT	2026-01-10 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3276	WOD	CROSSFIT	2026-01-17 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3277	WOD	CROSSFIT	2026-01-24 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3278	WOD	CROSSFIT	2026-01-31 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3279	WOD	CROSSFIT	2026-02-07 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3280	WOD	CROSSFIT	2026-02-14 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3281	WOD	CROSSFIT	2026-02-21 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3282	WOD	CROSSFIT	2026-02-28 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3283	WOD	CROSSFIT	2026-03-07 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3284	WOD	CROSSFIT	2026-03-14 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3285	WOD	CROSSFIT	2026-03-21 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3286	WOD	CROSSFIT	2026-03-28 08:00:00	60	Karl Sasi	14	Must saal	t	2	2	3234	\N	\N	\N	t	f
3287	WOD	CROSSFIT	2025-03-30 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
3288	WOD	CROSSFIT	2025-04-06 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3289	WOD	CROSSFIT	2025-04-13 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3290	WOD	CROSSFIT	2025-04-20 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3291	WOD	CROSSFIT	2025-04-27 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3292	WOD	CROSSFIT	2025-05-04 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3293	WOD	CROSSFIT	2025-05-11 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3294	WOD	CROSSFIT	2025-05-18 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3295	WOD	CROSSFIT	2025-05-25 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3296	WOD	CROSSFIT	2025-06-01 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3297	WOD	CROSSFIT	2025-06-08 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3298	WOD	CROSSFIT	2025-06-15 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3020	WOD	CROSSFIT	2026-03-19 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3021	WOD	CROSSFIT	2026-03-26 17:00:00	60	Karl Sasi	14	Must saal	t	2	2	2969	\N	\N	\N	t	f
3022	WOD	CROSSFIT	2025-03-28 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
3023	WOD	CROSSFIT	2025-04-04 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3024	WOD	CROSSFIT	2025-04-11 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3025	WOD	CROSSFIT	2025-04-18 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3026	WOD	CROSSFIT	2025-04-25 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3027	WOD	CROSSFIT	2025-05-02 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3028	WOD	CROSSFIT	2025-05-09 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3029	WOD	CROSSFIT	2025-05-16 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3030	WOD	CROSSFIT	2025-05-23 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3031	WOD	CROSSFIT	2025-05-30 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3032	WOD	CROSSFIT	2025-06-06 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3033	WOD	CROSSFIT	2025-06-13 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3034	WOD	CROSSFIT	2025-06-20 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3035	WOD	CROSSFIT	2025-06-27 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3036	WOD	CROSSFIT	2025-07-04 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3037	WOD	CROSSFIT	2025-07-11 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3038	WOD	CROSSFIT	2025-07-18 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3039	WOD	CROSSFIT	2025-07-25 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3040	WOD	CROSSFIT	2025-08-01 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3041	WOD	CROSSFIT	2025-08-08 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3042	WOD	CROSSFIT	2025-08-15 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3043	WOD	CROSSFIT	2025-08-22 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3044	WOD	CROSSFIT	2025-08-29 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3045	WOD	CROSSFIT	2025-09-05 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3046	WOD	CROSSFIT	2025-09-12 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3047	WOD	CROSSFIT	2025-09-19 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3048	WOD	CROSSFIT	2025-09-26 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3049	WOD	CROSSFIT	2025-10-03 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3050	WOD	CROSSFIT	2025-10-10 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3051	WOD	CROSSFIT	2025-10-17 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3052	WOD	CROSSFIT	2025-10-24 09:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3053	WOD	CROSSFIT	2025-10-31 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3054	WOD	CROSSFIT	2025-11-07 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3055	WOD	CROSSFIT	2025-11-14 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3056	WOD	CROSSFIT	2025-11-21 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3057	WOD	CROSSFIT	2025-11-28 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3058	WOD	CROSSFIT	2025-12-05 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3059	WOD	CROSSFIT	2025-12-12 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3060	WOD	CROSSFIT	2025-12-19 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3061	WOD	CROSSFIT	2025-12-26 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3062	WOD	CROSSFIT	2026-01-02 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3063	WOD	CROSSFIT	2026-01-09 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3064	WOD	CROSSFIT	2026-01-16 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3065	WOD	CROSSFIT	2026-01-23 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3066	WOD	CROSSFIT	2026-01-30 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3067	WOD	CROSSFIT	2026-02-06 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3068	WOD	CROSSFIT	2026-02-13 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3069	WOD	CROSSFIT	2026-02-20 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3070	WOD	CROSSFIT	2026-02-27 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3071	WOD	CROSSFIT	2026-03-06 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3072	WOD	CROSSFIT	2026-03-13 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3073	WOD	CROSSFIT	2026-03-20 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3074	WOD	CROSSFIT	2026-03-27 10:00:00	60	Karl Sasi	14	Must saal	t	2	2	3022	\N	\N	\N	t	f
3075	WOD	CROSSFIT	2025-03-28 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
3076	WOD	CROSSFIT	2025-04-04 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3077	WOD	CROSSFIT	2025-04-11 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3078	WOD	CROSSFIT	2025-04-18 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3079	WOD	CROSSFIT	2025-04-25 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3080	WOD	CROSSFIT	2025-05-02 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3081	WOD	CROSSFIT	2025-05-09 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3082	WOD	CROSSFIT	2025-05-16 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3083	WOD	CROSSFIT	2025-05-23 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3084	WOD	CROSSFIT	2025-05-30 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3085	WOD	CROSSFIT	2025-06-06 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3086	WOD	CROSSFIT	2025-06-13 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3087	WOD	CROSSFIT	2025-06-20 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3088	WOD	CROSSFIT	2025-06-27 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3089	WOD	CROSSFIT	2025-07-04 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3090	WOD	CROSSFIT	2025-07-11 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3091	WOD	CROSSFIT	2025-07-18 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3092	WOD	CROSSFIT	2025-07-25 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3093	WOD	CROSSFIT	2025-08-01 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3094	WOD	CROSSFIT	2025-08-08 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3095	WOD	CROSSFIT	2025-08-15 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3096	WOD	CROSSFIT	2025-08-22 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3097	WOD	CROSSFIT	2025-08-29 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3098	WOD	CROSSFIT	2025-09-05 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3099	WOD	CROSSFIT	2025-09-12 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3100	WOD	CROSSFIT	2025-09-19 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3101	WOD	CROSSFIT	2025-09-26 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3102	WOD	CROSSFIT	2025-10-03 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3103	WOD	CROSSFIT	2025-10-10 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3104	WOD	CROSSFIT	2025-10-17 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3105	WOD	CROSSFIT	2025-10-24 12:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3106	WOD	CROSSFIT	2025-10-31 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3107	WOD	CROSSFIT	2025-11-07 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3108	WOD	CROSSFIT	2025-11-14 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3109	WOD	CROSSFIT	2025-11-21 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3110	WOD	CROSSFIT	2025-11-28 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3111	WOD	CROSSFIT	2025-12-05 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3112	WOD	CROSSFIT	2025-12-12 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3113	WOD	CROSSFIT	2025-12-19 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3114	WOD	CROSSFIT	2025-12-26 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3115	WOD	CROSSFIT	2026-01-02 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3116	WOD	CROSSFIT	2026-01-09 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3117	WOD	CROSSFIT	2026-01-16 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3118	WOD	CROSSFIT	2026-01-23 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3119	WOD	CROSSFIT	2026-01-30 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3120	WOD	CROSSFIT	2026-02-06 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3121	WOD	CROSSFIT	2026-02-13 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3122	WOD	CROSSFIT	2026-02-20 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3123	WOD	CROSSFIT	2026-02-27 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3124	WOD	CROSSFIT	2026-03-06 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3125	WOD	CROSSFIT	2026-03-13 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3126	WOD	CROSSFIT	2026-03-20 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3127	WOD	CROSSFIT	2026-03-27 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3075	\N	\N	\N	t	f
3128	WOD	CROSSFIT	2025-03-28 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
3129	WOD	CROSSFIT	2025-04-04 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3130	WOD	CROSSFIT	2025-04-11 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3131	WOD	CROSSFIT	2025-04-18 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3132	WOD	CROSSFIT	2025-04-25 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3133	WOD	CROSSFIT	2025-05-02 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3134	WOD	CROSSFIT	2025-05-09 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3135	WOD	CROSSFIT	2025-05-16 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3136	WOD	CROSSFIT	2025-05-23 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3137	WOD	CROSSFIT	2025-05-30 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3138	WOD	CROSSFIT	2025-06-06 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3139	WOD	CROSSFIT	2025-06-13 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3140	WOD	CROSSFIT	2025-06-20 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3141	WOD	CROSSFIT	2025-06-27 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3142	WOD	CROSSFIT	2025-07-04 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3143	WOD	CROSSFIT	2025-07-11 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3144	WOD	CROSSFIT	2025-07-18 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3145	WOD	CROSSFIT	2025-07-25 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3146	WOD	CROSSFIT	2025-08-01 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3147	WOD	CROSSFIT	2025-08-08 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3148	WOD	CROSSFIT	2025-08-15 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3149	WOD	CROSSFIT	2025-08-22 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3150	WOD	CROSSFIT	2025-08-29 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3151	WOD	CROSSFIT	2025-09-05 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3152	WOD	CROSSFIT	2025-09-12 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3153	WOD	CROSSFIT	2025-09-19 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3154	WOD	CROSSFIT	2025-09-26 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3155	WOD	CROSSFIT	2025-10-03 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3156	WOD	CROSSFIT	2025-10-10 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3157	WOD	CROSSFIT	2025-10-17 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3158	WOD	CROSSFIT	2025-10-24 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3159	WOD	CROSSFIT	2025-10-31 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3160	WOD	CROSSFIT	2025-11-07 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3161	WOD	CROSSFIT	2025-11-14 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3162	WOD	CROSSFIT	2025-11-21 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3163	WOD	CROSSFIT	2025-11-28 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3164	WOD	CROSSFIT	2025-12-05 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3165	WOD	CROSSFIT	2025-12-12 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3166	WOD	CROSSFIT	2025-12-19 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3167	WOD	CROSSFIT	2025-12-26 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3168	WOD	CROSSFIT	2026-01-02 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3169	WOD	CROSSFIT	2026-01-09 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3170	WOD	CROSSFIT	2026-01-16 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3171	WOD	CROSSFIT	2026-01-23 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3172	WOD	CROSSFIT	2026-01-30 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3173	WOD	CROSSFIT	2026-02-06 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3174	WOD	CROSSFIT	2026-02-13 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3175	WOD	CROSSFIT	2026-02-20 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3176	WOD	CROSSFIT	2026-02-27 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3177	WOD	CROSSFIT	2026-03-06 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3178	WOD	CROSSFIT	2026-03-13 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3179	WOD	CROSSFIT	2026-03-20 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3180	WOD	CROSSFIT	2026-03-27 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3128	\N	\N	\N	t	f
3299	WOD	CROSSFIT	2025-06-22 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3300	WOD	CROSSFIT	2025-06-29 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3301	WOD	CROSSFIT	2025-07-06 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3302	WOD	CROSSFIT	2025-07-13 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3303	WOD	CROSSFIT	2025-07-20 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3304	WOD	CROSSFIT	2025-07-27 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3305	WOD	CROSSFIT	2025-08-03 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3306	WOD	CROSSFIT	2025-08-10 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3307	WOD	CROSSFIT	2025-08-17 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3308	WOD	CROSSFIT	2025-08-24 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3309	WOD	CROSSFIT	2025-08-31 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3310	WOD	CROSSFIT	2025-09-07 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3311	WOD	CROSSFIT	2025-09-14 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3312	WOD	CROSSFIT	2025-09-21 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3313	WOD	CROSSFIT	2025-09-28 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3314	WOD	CROSSFIT	2025-10-05 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3315	WOD	CROSSFIT	2025-10-12 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3316	WOD	CROSSFIT	2025-10-19 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3317	WOD	CROSSFIT	2025-10-26 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3318	WOD	CROSSFIT	2025-11-02 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3319	WOD	CROSSFIT	2025-11-09 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3320	WOD	CROSSFIT	2025-11-16 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3321	WOD	CROSSFIT	2025-11-23 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3322	WOD	CROSSFIT	2025-11-30 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3323	WOD	CROSSFIT	2025-12-07 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3324	WOD	CROSSFIT	2025-12-14 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3325	WOD	CROSSFIT	2025-12-21 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3326	WOD	CROSSFIT	2025-12-28 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3327	WOD	CROSSFIT	2026-01-04 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3328	WOD	CROSSFIT	2026-01-11 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3329	WOD	CROSSFIT	2026-01-18 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3330	WOD	CROSSFIT	2026-01-25 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3331	WOD	CROSSFIT	2026-02-01 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3332	WOD	CROSSFIT	2026-02-08 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3333	WOD	CROSSFIT	2026-02-15 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3334	WOD	CROSSFIT	2026-02-22 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3335	WOD	CROSSFIT	2026-03-01 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3336	WOD	CROSSFIT	2026-03-08 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3337	WOD	CROSSFIT	2026-03-15 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3338	WOD	CROSSFIT	2026-03-22 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3339	WOD	CROSSFIT	2026-03-29 13:00:00	60	Karl Sasi	14	Must saal	t	2	2	3287	\N	\N	\N	t	f
3340	WOD	CROSSFIT	2025-03-30 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	\N		For Time	\N	t	f
3341	WOD	CROSSFIT	2025-04-06 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3342	WOD	CROSSFIT	2025-04-13 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3343	WOD	CROSSFIT	2025-04-20 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3344	WOD	CROSSFIT	2025-04-27 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3345	WOD	CROSSFIT	2025-05-04 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3346	WOD	CROSSFIT	2025-05-11 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3347	WOD	CROSSFIT	2025-05-18 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3348	WOD	CROSSFIT	2025-05-25 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3349	WOD	CROSSFIT	2025-06-01 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3350	WOD	CROSSFIT	2025-06-08 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3351	WOD	CROSSFIT	2025-06-15 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3352	WOD	CROSSFIT	2025-06-22 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3353	WOD	CROSSFIT	2025-06-29 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3354	WOD	CROSSFIT	2025-07-06 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3355	WOD	CROSSFIT	2025-07-13 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3356	WOD	CROSSFIT	2025-07-20 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3357	WOD	CROSSFIT	2025-07-27 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3358	WOD	CROSSFIT	2025-08-03 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3359	WOD	CROSSFIT	2025-08-10 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3360	WOD	CROSSFIT	2025-08-17 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3361	WOD	CROSSFIT	2025-08-24 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3362	WOD	CROSSFIT	2025-08-31 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3363	WOD	CROSSFIT	2025-09-07 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3364	WOD	CROSSFIT	2025-09-14 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3365	WOD	CROSSFIT	2025-09-21 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3366	WOD	CROSSFIT	2025-09-28 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3367	WOD	CROSSFIT	2025-10-05 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3368	WOD	CROSSFIT	2025-10-12 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3369	WOD	CROSSFIT	2025-10-19 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3370	WOD	CROSSFIT	2025-10-26 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3371	WOD	CROSSFIT	2025-11-02 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3372	WOD	CROSSFIT	2025-11-09 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3373	WOD	CROSSFIT	2025-11-16 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3374	WOD	CROSSFIT	2025-11-23 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3375	WOD	CROSSFIT	2025-11-30 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3376	WOD	CROSSFIT	2025-12-07 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3377	WOD	CROSSFIT	2025-12-14 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3378	WOD	CROSSFIT	2025-12-21 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3379	WOD	CROSSFIT	2025-12-28 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3380	WOD	CROSSFIT	2026-01-04 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3381	WOD	CROSSFIT	2026-01-11 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3382	WOD	CROSSFIT	2026-01-18 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3383	WOD	CROSSFIT	2026-01-25 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3384	WOD	CROSSFIT	2026-02-01 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3385	WOD	CROSSFIT	2026-02-08 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3386	WOD	CROSSFIT	2026-02-15 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3387	WOD	CROSSFIT	2026-02-22 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3388	WOD	CROSSFIT	2026-03-01 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3389	WOD	CROSSFIT	2026-03-08 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3390	WOD	CROSSFIT	2026-03-15 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3391	WOD	CROSSFIT	2026-03-22 15:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3392	WOD	CROSSFIT	2026-03-29 14:00:00	60	Karl Sasi	14	Must saal	t	2	2	3340	\N	\N	\N	t	f
3393	Weightlifting	WEIGHTLIFTING	2025-03-25 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	\N		For Time	\N	t	f
3394	Weightlifting	WEIGHTLIFTING	2025-04-01 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3395	Weightlifting	WEIGHTLIFTING	2025-04-08 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3396	Weightlifting	WEIGHTLIFTING	2025-04-15 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3397	Weightlifting	WEIGHTLIFTING	2025-04-22 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3398	Weightlifting	WEIGHTLIFTING	2025-04-29 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3399	Weightlifting	WEIGHTLIFTING	2025-05-06 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3400	Weightlifting	WEIGHTLIFTING	2025-05-13 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3401	Weightlifting	WEIGHTLIFTING	2025-05-20 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3402	Weightlifting	WEIGHTLIFTING	2025-05-27 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3403	Weightlifting	WEIGHTLIFTING	2025-06-03 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3404	Weightlifting	WEIGHTLIFTING	2025-06-10 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3405	Weightlifting	WEIGHTLIFTING	2025-06-17 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3406	Weightlifting	WEIGHTLIFTING	2025-06-24 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3407	Weightlifting	WEIGHTLIFTING	2025-07-01 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3408	Weightlifting	WEIGHTLIFTING	2025-07-08 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3409	Weightlifting	WEIGHTLIFTING	2025-07-15 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3410	Weightlifting	WEIGHTLIFTING	2025-07-22 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3411	Weightlifting	WEIGHTLIFTING	2025-07-29 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3412	Weightlifting	WEIGHTLIFTING	2025-08-05 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3413	Weightlifting	WEIGHTLIFTING	2025-08-12 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3414	Weightlifting	WEIGHTLIFTING	2025-08-19 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3415	Weightlifting	WEIGHTLIFTING	2025-08-26 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3416	Weightlifting	WEIGHTLIFTING	2025-09-02 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3417	Weightlifting	WEIGHTLIFTING	2025-09-09 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3418	Weightlifting	WEIGHTLIFTING	2025-09-16 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3419	Weightlifting	WEIGHTLIFTING	2025-09-23 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3420	Weightlifting	WEIGHTLIFTING	2025-09-30 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3421	Weightlifting	WEIGHTLIFTING	2025-10-07 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3422	Weightlifting	WEIGHTLIFTING	2025-10-14 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3423	Weightlifting	WEIGHTLIFTING	2025-10-21 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3424	Weightlifting	WEIGHTLIFTING	2025-10-28 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3425	Weightlifting	WEIGHTLIFTING	2025-11-04 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3426	Weightlifting	WEIGHTLIFTING	2025-11-11 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3427	Weightlifting	WEIGHTLIFTING	2025-11-18 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3428	Weightlifting	WEIGHTLIFTING	2025-11-25 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3429	Weightlifting	WEIGHTLIFTING	2025-12-02 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3430	Weightlifting	WEIGHTLIFTING	2025-12-09 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3431	Weightlifting	WEIGHTLIFTING	2025-12-16 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3432	Weightlifting	WEIGHTLIFTING	2025-12-23 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3433	Weightlifting	WEIGHTLIFTING	2025-12-30 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3434	Weightlifting	WEIGHTLIFTING	2026-01-06 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3435	Weightlifting	WEIGHTLIFTING	2026-01-13 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3436	Weightlifting	WEIGHTLIFTING	2026-01-20 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3437	Weightlifting	WEIGHTLIFTING	2026-01-27 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3438	Weightlifting	WEIGHTLIFTING	2026-02-03 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3439	Weightlifting	WEIGHTLIFTING	2026-02-10 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3440	Weightlifting	WEIGHTLIFTING	2026-02-17 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3441	Weightlifting	WEIGHTLIFTING	2026-02-24 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3442	Weightlifting	WEIGHTLIFTING	2026-03-03 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3443	Weightlifting	WEIGHTLIFTING	2026-03-10 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3444	Weightlifting	WEIGHTLIFTING	2026-03-17 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3445	Weightlifting	WEIGHTLIFTING	2026-03-24 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3393	\N	\N	\N	t	f
3446	Weightlifting	WEIGHTLIFTING	2025-03-25 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	\N		For Time	\N	t	f
3447	Weightlifting	WEIGHTLIFTING	2025-04-01 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3448	Weightlifting	WEIGHTLIFTING	2025-04-08 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3449	Weightlifting	WEIGHTLIFTING	2025-04-15 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3450	Weightlifting	WEIGHTLIFTING	2025-04-22 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3451	Weightlifting	WEIGHTLIFTING	2025-04-29 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3452	Weightlifting	WEIGHTLIFTING	2025-05-06 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3453	Weightlifting	WEIGHTLIFTING	2025-05-13 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3454	Weightlifting	WEIGHTLIFTING	2025-05-20 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3455	Weightlifting	WEIGHTLIFTING	2025-05-27 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3456	Weightlifting	WEIGHTLIFTING	2025-06-03 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3457	Weightlifting	WEIGHTLIFTING	2025-06-10 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3458	Weightlifting	WEIGHTLIFTING	2025-06-17 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3459	Weightlifting	WEIGHTLIFTING	2025-06-24 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3460	Weightlifting	WEIGHTLIFTING	2025-07-01 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3461	Weightlifting	WEIGHTLIFTING	2025-07-08 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3462	Weightlifting	WEIGHTLIFTING	2025-07-15 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3463	Weightlifting	WEIGHTLIFTING	2025-07-22 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3464	Weightlifting	WEIGHTLIFTING	2025-07-29 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3465	Weightlifting	WEIGHTLIFTING	2025-08-05 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3466	Weightlifting	WEIGHTLIFTING	2025-08-12 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3467	Weightlifting	WEIGHTLIFTING	2025-08-19 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3468	Weightlifting	WEIGHTLIFTING	2025-08-26 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3469	Weightlifting	WEIGHTLIFTING	2025-09-02 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3470	Weightlifting	WEIGHTLIFTING	2025-09-09 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3471	Weightlifting	WEIGHTLIFTING	2025-09-16 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3472	Weightlifting	WEIGHTLIFTING	2025-09-23 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3473	Weightlifting	WEIGHTLIFTING	2025-09-30 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3474	Weightlifting	WEIGHTLIFTING	2025-10-07 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3475	Weightlifting	WEIGHTLIFTING	2025-10-14 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3476	Weightlifting	WEIGHTLIFTING	2025-10-21 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3477	Weightlifting	WEIGHTLIFTING	2025-10-28 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3478	Weightlifting	WEIGHTLIFTING	2025-11-04 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3479	Weightlifting	WEIGHTLIFTING	2025-11-11 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3480	Weightlifting	WEIGHTLIFTING	2025-11-18 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3481	Weightlifting	WEIGHTLIFTING	2025-11-25 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3482	Weightlifting	WEIGHTLIFTING	2025-12-02 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3483	Weightlifting	WEIGHTLIFTING	2025-12-09 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3484	Weightlifting	WEIGHTLIFTING	2025-12-16 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3485	Weightlifting	WEIGHTLIFTING	2025-12-23 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3486	Weightlifting	WEIGHTLIFTING	2025-12-30 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3487	Weightlifting	WEIGHTLIFTING	2026-01-06 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3488	Weightlifting	WEIGHTLIFTING	2026-01-13 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3489	Weightlifting	WEIGHTLIFTING	2026-01-20 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3490	Weightlifting	WEIGHTLIFTING	2026-01-27 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3491	Weightlifting	WEIGHTLIFTING	2026-02-03 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3492	Weightlifting	WEIGHTLIFTING	2026-02-10 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3493	Weightlifting	WEIGHTLIFTING	2026-02-17 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3494	Weightlifting	WEIGHTLIFTING	2026-02-24 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3495	Weightlifting	WEIGHTLIFTING	2026-03-03 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3496	Weightlifting	WEIGHTLIFTING	2026-03-10 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3497	Weightlifting	WEIGHTLIFTING	2026-03-17 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3498	Weightlifting	WEIGHTLIFTING	2026-03-24 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3446	\N	\N	\N	t	f
3499	Weightlifting	WEIGHTLIFTING	2025-03-27 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	\N		For Time	\N	t	f
3500	Weightlifting	WEIGHTLIFTING	2025-04-03 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3501	Weightlifting	WEIGHTLIFTING	2025-04-10 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3502	Weightlifting	WEIGHTLIFTING	2025-04-17 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3503	Weightlifting	WEIGHTLIFTING	2025-04-24 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3504	Weightlifting	WEIGHTLIFTING	2025-05-01 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3505	Weightlifting	WEIGHTLIFTING	2025-05-08 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3506	Weightlifting	WEIGHTLIFTING	2025-05-15 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3507	Weightlifting	WEIGHTLIFTING	2025-05-22 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3508	Weightlifting	WEIGHTLIFTING	2025-05-29 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3509	Weightlifting	WEIGHTLIFTING	2025-06-05 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3510	Weightlifting	WEIGHTLIFTING	2025-06-12 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3511	Weightlifting	WEIGHTLIFTING	2025-06-19 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3512	Weightlifting	WEIGHTLIFTING	2025-06-26 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3513	Weightlifting	WEIGHTLIFTING	2025-07-03 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3514	Weightlifting	WEIGHTLIFTING	2025-07-10 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3515	Weightlifting	WEIGHTLIFTING	2025-07-17 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3516	Weightlifting	WEIGHTLIFTING	2025-07-24 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3517	Weightlifting	WEIGHTLIFTING	2025-07-31 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3518	Weightlifting	WEIGHTLIFTING	2025-08-07 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3519	Weightlifting	WEIGHTLIFTING	2025-08-14 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3520	Weightlifting	WEIGHTLIFTING	2025-08-21 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3521	Weightlifting	WEIGHTLIFTING	2025-08-28 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3522	Weightlifting	WEIGHTLIFTING	2025-09-04 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3523	Weightlifting	WEIGHTLIFTING	2025-09-11 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3524	Weightlifting	WEIGHTLIFTING	2025-09-18 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3525	Weightlifting	WEIGHTLIFTING	2025-09-25 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3526	Weightlifting	WEIGHTLIFTING	2025-10-02 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3527	Weightlifting	WEIGHTLIFTING	2025-10-09 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3528	Weightlifting	WEIGHTLIFTING	2025-10-16 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3529	Weightlifting	WEIGHTLIFTING	2025-10-23 16:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3530	Weightlifting	WEIGHTLIFTING	2025-10-30 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3531	Weightlifting	WEIGHTLIFTING	2025-11-06 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3532	Weightlifting	WEIGHTLIFTING	2025-11-13 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3533	Weightlifting	WEIGHTLIFTING	2025-11-20 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3534	Weightlifting	WEIGHTLIFTING	2025-11-27 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3535	Weightlifting	WEIGHTLIFTING	2025-12-04 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3536	Weightlifting	WEIGHTLIFTING	2025-12-11 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3537	Weightlifting	WEIGHTLIFTING	2025-12-18 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3538	Weightlifting	WEIGHTLIFTING	2025-12-25 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3539	Weightlifting	WEIGHTLIFTING	2026-01-01 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3540	Weightlifting	WEIGHTLIFTING	2026-01-08 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3541	Weightlifting	WEIGHTLIFTING	2026-01-15 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3542	Weightlifting	WEIGHTLIFTING	2026-01-22 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3543	Weightlifting	WEIGHTLIFTING	2026-01-29 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3544	Weightlifting	WEIGHTLIFTING	2026-02-05 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3545	Weightlifting	WEIGHTLIFTING	2026-02-12 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3546	Weightlifting	WEIGHTLIFTING	2026-02-19 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3547	Weightlifting	WEIGHTLIFTING	2026-02-26 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3548	Weightlifting	WEIGHTLIFTING	2026-03-05 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3549	Weightlifting	WEIGHTLIFTING	2026-03-12 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3550	Weightlifting	WEIGHTLIFTING	2026-03-19 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3551	Weightlifting	WEIGHTLIFTING	2026-03-26 17:15:00	90	Merit Mandel	8	Must saal	t	2	2	3499	\N	\N	\N	t	f
3552	Weightlifting	WEIGHTLIFTING	2025-03-27 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	\N		For Time	\N	t	f
3553	Weightlifting	WEIGHTLIFTING	2025-04-03 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3554	Weightlifting	WEIGHTLIFTING	2025-04-10 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3555	Weightlifting	WEIGHTLIFTING	2025-04-17 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3556	Weightlifting	WEIGHTLIFTING	2025-04-24 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3557	Weightlifting	WEIGHTLIFTING	2025-05-01 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3558	Weightlifting	WEIGHTLIFTING	2025-05-08 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3559	Weightlifting	WEIGHTLIFTING	2025-05-15 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3560	Weightlifting	WEIGHTLIFTING	2025-05-22 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3561	Weightlifting	WEIGHTLIFTING	2025-05-29 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3562	Weightlifting	WEIGHTLIFTING	2025-06-05 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3563	Weightlifting	WEIGHTLIFTING	2025-06-12 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3564	Weightlifting	WEIGHTLIFTING	2025-06-19 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3565	Weightlifting	WEIGHTLIFTING	2025-06-26 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3566	Weightlifting	WEIGHTLIFTING	2025-07-03 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3567	Weightlifting	WEIGHTLIFTING	2025-07-10 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3568	Weightlifting	WEIGHTLIFTING	2025-07-17 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3569	Weightlifting	WEIGHTLIFTING	2025-07-24 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3570	Weightlifting	WEIGHTLIFTING	2025-07-31 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3571	Weightlifting	WEIGHTLIFTING	2025-08-07 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3572	Weightlifting	WEIGHTLIFTING	2025-08-14 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3573	Weightlifting	WEIGHTLIFTING	2025-08-21 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3574	Weightlifting	WEIGHTLIFTING	2025-08-28 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3575	Weightlifting	WEIGHTLIFTING	2025-09-04 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3576	Weightlifting	WEIGHTLIFTING	2025-09-11 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3577	Weightlifting	WEIGHTLIFTING	2025-09-18 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3578	Weightlifting	WEIGHTLIFTING	2025-09-25 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3579	Weightlifting	WEIGHTLIFTING	2025-10-02 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3580	Weightlifting	WEIGHTLIFTING	2025-10-09 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3581	Weightlifting	WEIGHTLIFTING	2025-10-16 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3582	Weightlifting	WEIGHTLIFTING	2025-10-23 14:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3583	Weightlifting	WEIGHTLIFTING	2025-10-30 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3584	Weightlifting	WEIGHTLIFTING	2025-11-06 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3585	Weightlifting	WEIGHTLIFTING	2025-11-13 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3586	Weightlifting	WEIGHTLIFTING	2025-11-20 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3587	Weightlifting	WEIGHTLIFTING	2025-11-27 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3588	Weightlifting	WEIGHTLIFTING	2025-12-04 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3589	Weightlifting	WEIGHTLIFTING	2025-12-11 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3590	Weightlifting	WEIGHTLIFTING	2025-12-18 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3591	Weightlifting	WEIGHTLIFTING	2025-12-25 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3592	Weightlifting	WEIGHTLIFTING	2026-01-01 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3593	Weightlifting	WEIGHTLIFTING	2026-01-08 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3594	Weightlifting	WEIGHTLIFTING	2026-01-15 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3595	Weightlifting	WEIGHTLIFTING	2026-01-22 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3596	Weightlifting	WEIGHTLIFTING	2026-01-29 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3597	Weightlifting	WEIGHTLIFTING	2026-02-05 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3598	Weightlifting	WEIGHTLIFTING	2026-02-12 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3599	Weightlifting	WEIGHTLIFTING	2026-02-19 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3600	Weightlifting	WEIGHTLIFTING	2026-02-26 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3601	Weightlifting	WEIGHTLIFTING	2026-03-05 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3602	Weightlifting	WEIGHTLIFTING	2026-03-12 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3603	Weightlifting	WEIGHTLIFTING	2026-03-19 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3604	Weightlifting	WEIGHTLIFTING	2026-03-26 15:15:00	90	Merit Mandel	8	Must saal	t	2	2	3552	\N	\N	\N	t	f
3605	Other	OPEN GYM	2025-03-24 09:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
3606	Other	OPEN GYM	2025-03-31 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3607	Other	OPEN GYM	2025-04-07 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3608	Other	OPEN GYM	2025-04-14 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3609	Other	OPEN GYM	2025-04-21 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3610	Other	OPEN GYM	2025-04-28 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3611	Other	OPEN GYM	2025-05-05 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3612	Other	OPEN GYM	2025-05-12 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3613	Other	OPEN GYM	2025-05-19 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3614	Other	OPEN GYM	2025-05-26 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3615	Other	OPEN GYM	2025-06-02 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3616	Other	OPEN GYM	2025-06-09 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3617	Other	OPEN GYM	2025-06-16 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3618	Other	OPEN GYM	2025-06-23 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3619	Other	OPEN GYM	2025-06-30 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3620	Other	OPEN GYM	2025-07-07 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3621	Other	OPEN GYM	2025-07-14 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3622	Other	OPEN GYM	2025-07-21 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3623	Other	OPEN GYM	2025-07-28 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3624	Other	OPEN GYM	2025-08-04 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3625	Other	OPEN GYM	2025-08-11 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3626	Other	OPEN GYM	2025-08-18 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3627	Other	OPEN GYM	2025-08-25 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3628	Other	OPEN GYM	2025-09-01 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3629	Other	OPEN GYM	2025-09-08 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3630	Other	OPEN GYM	2025-09-15 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3631	Other	OPEN GYM	2025-09-22 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3632	Other	OPEN GYM	2025-09-29 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3633	Other	OPEN GYM	2025-10-06 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3634	Other	OPEN GYM	2025-10-13 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3635	Other	OPEN GYM	2025-10-20 08:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3636	Other	OPEN GYM	2025-10-27 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3637	Other	OPEN GYM	2025-11-03 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3638	Other	OPEN GYM	2025-11-10 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3639	Other	OPEN GYM	2025-11-17 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3640	Other	OPEN GYM	2025-11-24 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3641	Other	OPEN GYM	2025-12-01 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3642	Other	OPEN GYM	2025-12-08 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3643	Other	OPEN GYM	2025-12-15 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3644	Other	OPEN GYM	2025-12-22 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3645	Other	OPEN GYM	2025-12-29 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3646	Other	OPEN GYM	2026-01-05 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3647	Other	OPEN GYM	2026-01-12 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3648	Other	OPEN GYM	2026-01-19 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3649	Other	OPEN GYM	2026-01-26 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3650	Other	OPEN GYM	2026-02-02 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3651	Other	OPEN GYM	2026-02-09 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3652	Other	OPEN GYM	2026-02-16 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3653	Other	OPEN GYM	2026-02-23 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3654	Other	OPEN GYM	2026-03-02 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3655	Other	OPEN GYM	2026-03-09 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3656	Other	OPEN GYM	2026-03-16 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3657	Other	OPEN GYM	2026-03-23 09:00:00	120	Tarvi Torn	10		t	2	2	3605	\N	\N	\N	t	f
3658	Other	OPEN GYM	2025-03-25 09:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
3659	Other	OPEN GYM	2025-04-01 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3660	Other	OPEN GYM	2025-04-08 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3661	Other	OPEN GYM	2025-04-15 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3662	Other	OPEN GYM	2025-04-22 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3663	Other	OPEN GYM	2025-04-29 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3664	Other	OPEN GYM	2025-05-06 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3665	Other	OPEN GYM	2025-05-13 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3666	Other	OPEN GYM	2025-05-20 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3667	Other	OPEN GYM	2025-05-27 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3668	Other	OPEN GYM	2025-06-03 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3669	Other	OPEN GYM	2025-06-10 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3670	Other	OPEN GYM	2025-06-17 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3671	Other	OPEN GYM	2025-06-24 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3672	Other	OPEN GYM	2025-07-01 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3673	Other	OPEN GYM	2025-07-08 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3674	Other	OPEN GYM	2025-07-15 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3675	Other	OPEN GYM	2025-07-22 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3676	Other	OPEN GYM	2025-07-29 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3677	Other	OPEN GYM	2025-08-05 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3678	Other	OPEN GYM	2025-08-12 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3679	Other	OPEN GYM	2025-08-19 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3680	Other	OPEN GYM	2025-08-26 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3681	Other	OPEN GYM	2025-09-02 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3682	Other	OPEN GYM	2025-09-09 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3683	Other	OPEN GYM	2025-09-16 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3684	Other	OPEN GYM	2025-09-23 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3685	Other	OPEN GYM	2025-09-30 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3686	Other	OPEN GYM	2025-10-07 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3687	Other	OPEN GYM	2025-10-14 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3688	Other	OPEN GYM	2025-10-21 08:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3689	Other	OPEN GYM	2025-10-28 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3690	Other	OPEN GYM	2025-11-04 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3691	Other	OPEN GYM	2025-11-11 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3692	Other	OPEN GYM	2025-11-18 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3693	Other	OPEN GYM	2025-11-25 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3694	Other	OPEN GYM	2025-12-02 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3695	Other	OPEN GYM	2025-12-09 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3696	Other	OPEN GYM	2025-12-16 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3697	Other	OPEN GYM	2025-12-23 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3698	Other	OPEN GYM	2025-12-30 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3699	Other	OPEN GYM	2026-01-06 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3700	Other	OPEN GYM	2026-01-13 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3701	Other	OPEN GYM	2026-01-20 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3702	Other	OPEN GYM	2026-01-27 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3703	Other	OPEN GYM	2026-02-03 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3704	Other	OPEN GYM	2026-02-10 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3705	Other	OPEN GYM	2026-02-17 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3706	Other	OPEN GYM	2026-02-24 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3707	Other	OPEN GYM	2026-03-03 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3708	Other	OPEN GYM	2026-03-10 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3709	Other	OPEN GYM	2026-03-17 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3710	Other	OPEN GYM	2026-03-24 09:00:00	120	Tarvi Torn	10		t	2	2	3658	\N	\N	\N	t	f
3711	Other	OPEN GYM	2025-03-26 09:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
3712	Other	OPEN GYM	2025-04-02 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3713	Other	OPEN GYM	2025-04-09 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3714	Other	OPEN GYM	2025-04-16 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3715	Other	OPEN GYM	2025-04-23 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3716	Other	OPEN GYM	2025-04-30 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3717	Other	OPEN GYM	2025-05-07 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3718	Other	OPEN GYM	2025-05-14 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3719	Other	OPEN GYM	2025-05-21 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3720	Other	OPEN GYM	2025-05-28 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3721	Other	OPEN GYM	2025-06-04 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3722	Other	OPEN GYM	2025-06-11 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3723	Other	OPEN GYM	2025-06-18 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3724	Other	OPEN GYM	2025-06-25 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3725	Other	OPEN GYM	2025-07-02 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3726	Other	OPEN GYM	2025-07-09 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3727	Other	OPEN GYM	2025-07-16 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3728	Other	OPEN GYM	2025-07-23 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3729	Other	OPEN GYM	2025-07-30 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3730	Other	OPEN GYM	2025-08-06 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3731	Other	OPEN GYM	2025-08-13 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3732	Other	OPEN GYM	2025-08-20 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3733	Other	OPEN GYM	2025-08-27 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3734	Other	OPEN GYM	2025-09-03 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3735	Other	OPEN GYM	2025-09-10 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3736	Other	OPEN GYM	2025-09-17 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3737	Other	OPEN GYM	2025-09-24 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3738	Other	OPEN GYM	2025-10-01 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3739	Other	OPEN GYM	2025-10-08 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3740	Other	OPEN GYM	2025-10-15 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3741	Other	OPEN GYM	2025-10-22 08:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3742	Other	OPEN GYM	2025-10-29 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3743	Other	OPEN GYM	2025-11-05 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3744	Other	OPEN GYM	2025-11-12 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3745	Other	OPEN GYM	2025-11-19 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3746	Other	OPEN GYM	2025-11-26 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3747	Other	OPEN GYM	2025-12-03 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3748	Other	OPEN GYM	2025-12-10 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3749	Other	OPEN GYM	2025-12-17 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3750	Other	OPEN GYM	2025-12-24 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3751	Other	OPEN GYM	2025-12-31 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3752	Other	OPEN GYM	2026-01-07 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3753	Other	OPEN GYM	2026-01-14 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3754	Other	OPEN GYM	2026-01-21 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3755	Other	OPEN GYM	2026-01-28 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3756	Other	OPEN GYM	2026-02-04 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3757	Other	OPEN GYM	2026-02-11 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3758	Other	OPEN GYM	2026-02-18 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3759	Other	OPEN GYM	2026-02-25 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3760	Other	OPEN GYM	2026-03-04 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3761	Other	OPEN GYM	2026-03-11 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3762	Other	OPEN GYM	2026-03-18 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3763	Other	OPEN GYM	2026-03-25 09:00:00	120	Tarvi Torn	10		t	2	2	3711	\N	\N	\N	t	f
3764	Other	OPEN GYM	2025-03-27 09:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
3765	Other	OPEN GYM	2025-04-03 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3766	Other	OPEN GYM	2025-04-10 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3767	Other	OPEN GYM	2025-04-17 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3768	Other	OPEN GYM	2025-04-24 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3769	Other	OPEN GYM	2025-05-01 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3770	Other	OPEN GYM	2025-05-08 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3771	Other	OPEN GYM	2025-05-15 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3772	Other	OPEN GYM	2025-05-22 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3773	Other	OPEN GYM	2025-05-29 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3774	Other	OPEN GYM	2025-06-05 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3775	Other	OPEN GYM	2025-06-12 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3776	Other	OPEN GYM	2025-06-19 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3777	Other	OPEN GYM	2025-06-26 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3778	Other	OPEN GYM	2025-07-03 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3779	Other	OPEN GYM	2025-07-10 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3780	Other	OPEN GYM	2025-07-17 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3781	Other	OPEN GYM	2025-07-24 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3782	Other	OPEN GYM	2025-07-31 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3783	Other	OPEN GYM	2025-08-07 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3784	Other	OPEN GYM	2025-08-14 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3785	Other	OPEN GYM	2025-08-21 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3786	Other	OPEN GYM	2025-08-28 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3787	Other	OPEN GYM	2025-09-04 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3788	Other	OPEN GYM	2025-09-11 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3789	Other	OPEN GYM	2025-09-18 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3790	Other	OPEN GYM	2025-09-25 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3791	Other	OPEN GYM	2025-10-02 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3792	Other	OPEN GYM	2025-10-09 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3793	Other	OPEN GYM	2025-10-16 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3794	Other	OPEN GYM	2025-10-23 08:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3795	Other	OPEN GYM	2025-10-30 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3796	Other	OPEN GYM	2025-11-06 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3797	Other	OPEN GYM	2025-11-13 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3798	Other	OPEN GYM	2025-11-20 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3799	Other	OPEN GYM	2025-11-27 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3800	Other	OPEN GYM	2025-12-04 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3801	Other	OPEN GYM	2025-12-11 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3802	Other	OPEN GYM	2025-12-18 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3803	Other	OPEN GYM	2025-12-25 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3804	Other	OPEN GYM	2026-01-01 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3805	Other	OPEN GYM	2026-01-08 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3806	Other	OPEN GYM	2026-01-15 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3807	Other	OPEN GYM	2026-01-22 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3808	Other	OPEN GYM	2026-01-29 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3809	Other	OPEN GYM	2026-02-05 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3810	Other	OPEN GYM	2026-02-12 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3811	Other	OPEN GYM	2026-02-19 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3812	Other	OPEN GYM	2026-02-26 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3813	Other	OPEN GYM	2026-03-05 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3814	Other	OPEN GYM	2026-03-12 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3815	Other	OPEN GYM	2026-03-19 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3816	Other	OPEN GYM	2026-03-26 09:00:00	120	Tarvi Torn	10		t	2	2	3764	\N	\N	\N	t	f
3817	Other	OPEN GYM	2025-03-28 09:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
3818	Other	OPEN GYM	2025-04-04 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3819	Other	OPEN GYM	2025-04-11 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3820	Other	OPEN GYM	2025-04-18 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3821	Other	OPEN GYM	2025-04-25 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3822	Other	OPEN GYM	2025-05-02 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3823	Other	OPEN GYM	2025-05-09 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3824	Other	OPEN GYM	2025-05-16 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3825	Other	OPEN GYM	2025-05-23 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3826	Other	OPEN GYM	2025-05-30 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3827	Other	OPEN GYM	2025-06-06 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3828	Other	OPEN GYM	2025-06-13 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3829	Other	OPEN GYM	2025-06-20 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3830	Other	OPEN GYM	2025-06-27 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3831	Other	OPEN GYM	2025-07-04 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3832	Other	OPEN GYM	2025-07-11 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3833	Other	OPEN GYM	2025-07-18 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3834	Other	OPEN GYM	2025-07-25 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3835	Other	OPEN GYM	2025-08-01 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3836	Other	OPEN GYM	2025-08-08 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3837	Other	OPEN GYM	2025-08-15 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3838	Other	OPEN GYM	2025-08-22 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3839	Other	OPEN GYM	2025-08-29 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3840	Other	OPEN GYM	2025-09-05 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3841	Other	OPEN GYM	2025-09-12 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3842	Other	OPEN GYM	2025-09-19 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3843	Other	OPEN GYM	2025-09-26 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3844	Other	OPEN GYM	2025-10-03 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3845	Other	OPEN GYM	2025-10-10 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3846	Other	OPEN GYM	2025-10-17 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3847	Other	OPEN GYM	2025-10-24 08:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3848	Other	OPEN GYM	2025-10-31 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3849	Other	OPEN GYM	2025-11-07 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3850	Other	OPEN GYM	2025-11-14 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3851	Other	OPEN GYM	2025-11-21 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3852	Other	OPEN GYM	2025-11-28 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3853	Other	OPEN GYM	2025-12-05 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3854	Other	OPEN GYM	2025-12-12 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3855	Other	OPEN GYM	2025-12-19 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3856	Other	OPEN GYM	2025-12-26 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3857	Other	OPEN GYM	2026-01-02 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3858	Other	OPEN GYM	2026-01-09 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3859	Other	OPEN GYM	2026-01-16 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3860	Other	OPEN GYM	2026-01-23 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3861	Other	OPEN GYM	2026-01-30 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3862	Other	OPEN GYM	2026-02-06 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3863	Other	OPEN GYM	2026-02-13 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3864	Other	OPEN GYM	2026-02-20 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3865	Other	OPEN GYM	2026-02-27 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3866	Other	OPEN GYM	2026-03-06 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3867	Other	OPEN GYM	2026-03-13 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3868	Other	OPEN GYM	2026-03-20 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3869	Other	OPEN GYM	2026-03-27 09:00:00	120	Tarvi Torn	10		t	2	2	3817	\N	\N	\N	t	f
3871	Other	OPEN GYM	2025-03-31 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3872	Other	OPEN GYM	2025-04-07 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3873	Other	OPEN GYM	2025-04-14 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3874	Other	OPEN GYM	2025-04-21 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3875	Other	OPEN GYM	2025-04-28 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3876	Other	OPEN GYM	2025-05-05 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3877	Other	OPEN GYM	2025-05-12 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3878	Other	OPEN GYM	2025-05-19 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3879	Other	OPEN GYM	2025-05-26 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3880	Other	OPEN GYM	2025-06-02 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3881	Other	OPEN GYM	2025-06-09 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3882	Other	OPEN GYM	2025-06-16 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3883	Other	OPEN GYM	2025-06-23 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3884	Other	OPEN GYM	2025-06-30 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3885	Other	OPEN GYM	2025-07-07 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3886	Other	OPEN GYM	2025-07-14 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3887	Other	OPEN GYM	2025-07-21 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3888	Other	OPEN GYM	2025-07-28 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3889	Other	OPEN GYM	2025-08-04 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3890	Other	OPEN GYM	2025-08-11 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3891	Other	OPEN GYM	2025-08-18 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3892	Other	OPEN GYM	2025-08-25 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3893	Other	OPEN GYM	2025-09-01 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3894	Other	OPEN GYM	2025-09-08 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3895	Other	OPEN GYM	2025-09-15 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3896	Other	OPEN GYM	2025-09-22 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3897	Other	OPEN GYM	2025-09-29 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3898	Other	OPEN GYM	2025-10-06 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3899	Other	OPEN GYM	2025-10-13 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3900	Other	OPEN GYM	2025-10-20 10:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3901	Other	OPEN GYM	2025-10-27 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3902	Other	OPEN GYM	2025-11-03 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3903	Other	OPEN GYM	2025-11-10 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3904	Other	OPEN GYM	2025-11-17 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3905	Other	OPEN GYM	2025-11-24 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3906	Other	OPEN GYM	2025-12-01 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3907	Other	OPEN GYM	2025-12-08 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3908	Other	OPEN GYM	2025-12-15 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3909	Other	OPEN GYM	2025-12-22 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3910	Other	OPEN GYM	2025-12-29 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3911	Other	OPEN GYM	2026-01-05 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3912	Other	OPEN GYM	2026-01-12 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3913	Other	OPEN GYM	2026-01-19 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3914	Other	OPEN GYM	2026-01-26 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3915	Other	OPEN GYM	2026-02-02 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3916	Other	OPEN GYM	2026-02-09 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3917	Other	OPEN GYM	2026-02-16 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3918	Other	OPEN GYM	2026-02-23 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3919	Other	OPEN GYM	2026-03-02 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3920	Other	OPEN GYM	2026-03-09 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3921	Other	OPEN GYM	2026-03-16 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3922	Other	OPEN GYM	2026-03-23 11:00:00	120	Tarvi Torn	10		t	2	2	3870	\N	\N	\N	t	f
3923	Other	OPEN GYM	2025-03-25 11:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
3924	Other	OPEN GYM	2025-04-01 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3925	Other	OPEN GYM	2025-04-08 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3926	Other	OPEN GYM	2025-04-15 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3927	Other	OPEN GYM	2025-04-22 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3928	Other	OPEN GYM	2025-04-29 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3929	Other	OPEN GYM	2025-05-06 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3930	Other	OPEN GYM	2025-05-13 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3931	Other	OPEN GYM	2025-05-20 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3932	Other	OPEN GYM	2025-05-27 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3933	Other	OPEN GYM	2025-06-03 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3934	Other	OPEN GYM	2025-06-10 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3935	Other	OPEN GYM	2025-06-17 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3936	Other	OPEN GYM	2025-06-24 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3937	Other	OPEN GYM	2025-07-01 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3938	Other	OPEN GYM	2025-07-08 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3939	Other	OPEN GYM	2025-07-15 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3940	Other	OPEN GYM	2025-07-22 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3941	Other	OPEN GYM	2025-07-29 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3942	Other	OPEN GYM	2025-08-05 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3943	Other	OPEN GYM	2025-08-12 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3944	Other	OPEN GYM	2025-08-19 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3945	Other	OPEN GYM	2025-08-26 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3946	Other	OPEN GYM	2025-09-02 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3947	Other	OPEN GYM	2025-09-09 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3948	Other	OPEN GYM	2025-09-16 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3949	Other	OPEN GYM	2025-09-23 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3950	Other	OPEN GYM	2025-09-30 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3951	Other	OPEN GYM	2025-10-07 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3952	Other	OPEN GYM	2025-10-14 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3953	Other	OPEN GYM	2025-10-21 10:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3954	Other	OPEN GYM	2025-10-28 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3955	Other	OPEN GYM	2025-11-04 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3956	Other	OPEN GYM	2025-11-11 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3957	Other	OPEN GYM	2025-11-18 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3958	Other	OPEN GYM	2025-11-25 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3959	Other	OPEN GYM	2025-12-02 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3960	Other	OPEN GYM	2025-12-09 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3961	Other	OPEN GYM	2025-12-16 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3962	Other	OPEN GYM	2025-12-23 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3963	Other	OPEN GYM	2025-12-30 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3964	Other	OPEN GYM	2026-01-06 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3965	Other	OPEN GYM	2026-01-13 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3966	Other	OPEN GYM	2026-01-20 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3967	Other	OPEN GYM	2026-01-27 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3968	Other	OPEN GYM	2026-02-03 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3969	Other	OPEN GYM	2026-02-10 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3970	Other	OPEN GYM	2026-02-17 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3971	Other	OPEN GYM	2026-02-24 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3972	Other	OPEN GYM	2026-03-03 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3973	Other	OPEN GYM	2026-03-10 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3974	Other	OPEN GYM	2026-03-17 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3975	Other	OPEN GYM	2026-03-24 11:00:00	120	Tarvi Torn	10		t	2	2	3923	\N	\N	\N	t	f
3976	Other	OPEN GYM	2025-03-26 11:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
3977	Other	OPEN GYM	2025-04-02 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3978	Other	OPEN GYM	2025-04-09 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3979	Other	OPEN GYM	2025-04-16 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3980	Other	OPEN GYM	2025-04-23 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3981	Other	OPEN GYM	2025-04-30 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3982	Other	OPEN GYM	2025-05-07 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3983	Other	OPEN GYM	2025-05-14 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3984	Other	OPEN GYM	2025-05-21 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3985	Other	OPEN GYM	2025-05-28 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3986	Other	OPEN GYM	2025-06-04 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3987	Other	OPEN GYM	2025-06-11 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3988	Other	OPEN GYM	2025-06-18 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3989	Other	OPEN GYM	2025-06-25 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3990	Other	OPEN GYM	2025-07-02 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3991	Other	OPEN GYM	2025-07-09 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3992	Other	OPEN GYM	2025-07-16 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3993	Other	OPEN GYM	2025-07-23 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3994	Other	OPEN GYM	2025-07-30 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3995	Other	OPEN GYM	2025-08-06 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3996	Other	OPEN GYM	2025-08-13 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3997	Other	OPEN GYM	2025-08-20 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3998	Other	OPEN GYM	2025-08-27 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
3999	Other	OPEN GYM	2025-09-03 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4000	Other	OPEN GYM	2025-09-10 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4001	Other	OPEN GYM	2025-09-17 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4002	Other	OPEN GYM	2025-09-24 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4003	Other	OPEN GYM	2025-10-01 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4004	Other	OPEN GYM	2025-10-08 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4005	Other	OPEN GYM	2025-10-15 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4006	Other	OPEN GYM	2025-10-22 10:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4007	Other	OPEN GYM	2025-10-29 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4008	Other	OPEN GYM	2025-11-05 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4009	Other	OPEN GYM	2025-11-12 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4010	Other	OPEN GYM	2025-11-19 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4011	Other	OPEN GYM	2025-11-26 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4012	Other	OPEN GYM	2025-12-03 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4013	Other	OPEN GYM	2025-12-10 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4014	Other	OPEN GYM	2025-12-17 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4015	Other	OPEN GYM	2025-12-24 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4016	Other	OPEN GYM	2025-12-31 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4017	Other	OPEN GYM	2026-01-07 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4018	Other	OPEN GYM	2026-01-14 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4019	Other	OPEN GYM	2026-01-21 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4020	Other	OPEN GYM	2026-01-28 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4021	Other	OPEN GYM	2026-02-04 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4022	Other	OPEN GYM	2026-02-11 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4023	Other	OPEN GYM	2026-02-18 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4024	Other	OPEN GYM	2026-02-25 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4025	Other	OPEN GYM	2026-03-04 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4026	Other	OPEN GYM	2026-03-11 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4027	Other	OPEN GYM	2026-03-18 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4028	Other	OPEN GYM	2026-03-25 11:00:00	120	Tarvi Torn	10		t	2	2	3976	\N	\N	\N	t	f
4029	Other	OPEN GYM	2025-03-27 11:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4030	Other	OPEN GYM	2025-04-03 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4031	Other	OPEN GYM	2025-04-10 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4032	Other	OPEN GYM	2025-04-17 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4033	Other	OPEN GYM	2025-04-24 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4034	Other	OPEN GYM	2025-05-01 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4035	Other	OPEN GYM	2025-05-08 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4036	Other	OPEN GYM	2025-05-15 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4037	Other	OPEN GYM	2025-05-22 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4038	Other	OPEN GYM	2025-05-29 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4039	Other	OPEN GYM	2025-06-05 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4040	Other	OPEN GYM	2025-06-12 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4041	Other	OPEN GYM	2025-06-19 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4042	Other	OPEN GYM	2025-06-26 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4043	Other	OPEN GYM	2025-07-03 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4044	Other	OPEN GYM	2025-07-10 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4045	Other	OPEN GYM	2025-07-17 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4046	Other	OPEN GYM	2025-07-24 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4047	Other	OPEN GYM	2025-07-31 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4048	Other	OPEN GYM	2025-08-07 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4049	Other	OPEN GYM	2025-08-14 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4050	Other	OPEN GYM	2025-08-21 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4051	Other	OPEN GYM	2025-08-28 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4052	Other	OPEN GYM	2025-09-04 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4053	Other	OPEN GYM	2025-09-11 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4054	Other	OPEN GYM	2025-09-18 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4055	Other	OPEN GYM	2025-09-25 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4056	Other	OPEN GYM	2025-10-02 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4057	Other	OPEN GYM	2025-10-09 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4058	Other	OPEN GYM	2025-10-16 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4059	Other	OPEN GYM	2025-10-23 10:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4060	Other	OPEN GYM	2025-10-30 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4061	Other	OPEN GYM	2025-11-06 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4062	Other	OPEN GYM	2025-11-13 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4063	Other	OPEN GYM	2025-11-20 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4064	Other	OPEN GYM	2025-11-27 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4065	Other	OPEN GYM	2025-12-04 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4066	Other	OPEN GYM	2025-12-11 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4067	Other	OPEN GYM	2025-12-18 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4068	Other	OPEN GYM	2025-12-25 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4069	Other	OPEN GYM	2026-01-01 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4070	Other	OPEN GYM	2026-01-08 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4071	Other	OPEN GYM	2026-01-15 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4072	Other	OPEN GYM	2026-01-22 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4073	Other	OPEN GYM	2026-01-29 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4074	Other	OPEN GYM	2026-02-05 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4075	Other	OPEN GYM	2026-02-12 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4076	Other	OPEN GYM	2026-02-19 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4077	Other	OPEN GYM	2026-02-26 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4078	Other	OPEN GYM	2026-03-05 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4079	Other	OPEN GYM	2026-03-12 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4080	Other	OPEN GYM	2026-03-19 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4081	Other	OPEN GYM	2026-03-26 11:00:00	120	Tarvi Torn	10		t	2	2	4029	\N	\N	\N	t	f
4082	Other	OPEN GYM	2025-03-28 11:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4083	Other	OPEN GYM	2025-04-04 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4084	Other	OPEN GYM	2025-04-11 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4085	Other	OPEN GYM	2025-04-18 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4086	Other	OPEN GYM	2025-04-25 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4087	Other	OPEN GYM	2025-05-02 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4088	Other	OPEN GYM	2025-05-09 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4089	Other	OPEN GYM	2025-05-16 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4090	Other	OPEN GYM	2025-05-23 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4091	Other	OPEN GYM	2025-05-30 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4092	Other	OPEN GYM	2025-06-06 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4093	Other	OPEN GYM	2025-06-13 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4094	Other	OPEN GYM	2025-06-20 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4095	Other	OPEN GYM	2025-06-27 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4096	Other	OPEN GYM	2025-07-04 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4097	Other	OPEN GYM	2025-07-11 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4098	Other	OPEN GYM	2025-07-18 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4099	Other	OPEN GYM	2025-07-25 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4100	Other	OPEN GYM	2025-08-01 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4101	Other	OPEN GYM	2025-08-08 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4102	Other	OPEN GYM	2025-08-15 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4103	Other	OPEN GYM	2025-08-22 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4104	Other	OPEN GYM	2025-08-29 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4105	Other	OPEN GYM	2025-09-05 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4106	Other	OPEN GYM	2025-09-12 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4107	Other	OPEN GYM	2025-09-19 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4108	Other	OPEN GYM	2025-09-26 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4109	Other	OPEN GYM	2025-10-03 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4110	Other	OPEN GYM	2025-10-10 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4111	Other	OPEN GYM	2025-10-17 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4112	Other	OPEN GYM	2025-10-24 10:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4113	Other	OPEN GYM	2025-10-31 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4114	Other	OPEN GYM	2025-11-07 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4115	Other	OPEN GYM	2025-11-14 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4116	Other	OPEN GYM	2025-11-21 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4117	Other	OPEN GYM	2025-11-28 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4118	Other	OPEN GYM	2025-12-05 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4119	Other	OPEN GYM	2025-12-12 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4120	Other	OPEN GYM	2025-12-19 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4121	Other	OPEN GYM	2025-12-26 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4122	Other	OPEN GYM	2026-01-02 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4123	Other	OPEN GYM	2026-01-09 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4124	Other	OPEN GYM	2026-01-16 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4125	Other	OPEN GYM	2026-01-23 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4126	Other	OPEN GYM	2026-01-30 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4127	Other	OPEN GYM	2026-02-06 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4128	Other	OPEN GYM	2026-02-13 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4129	Other	OPEN GYM	2026-02-20 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4130	Other	OPEN GYM	2026-02-27 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4131	Other	OPEN GYM	2026-03-06 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4132	Other	OPEN GYM	2026-03-13 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4133	Other	OPEN GYM	2026-03-20 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4134	Other	OPEN GYM	2026-03-27 11:00:00	120	Tarvi Torn	10		t	2	2	4082	\N	\N	\N	t	f
4294	Other	OPEN GYM	2025-03-27 13:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4295	Other	OPEN GYM	2025-04-03 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4296	Other	OPEN GYM	2025-04-10 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4297	Other	OPEN GYM	2025-04-17 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4298	Other	OPEN GYM	2025-04-24 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4299	Other	OPEN GYM	2025-05-01 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4300	Other	OPEN GYM	2025-05-08 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4301	Other	OPEN GYM	2025-05-15 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4302	Other	OPEN GYM	2025-05-22 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4303	Other	OPEN GYM	2025-05-29 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4304	Other	OPEN GYM	2025-06-05 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4305	Other	OPEN GYM	2025-06-12 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4306	Other	OPEN GYM	2025-06-19 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4307	Other	OPEN GYM	2025-06-26 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4308	Other	OPEN GYM	2025-07-03 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4309	Other	OPEN GYM	2025-07-10 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4310	Other	OPEN GYM	2025-07-17 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4311	Other	OPEN GYM	2025-07-24 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4312	Other	OPEN GYM	2025-07-31 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4313	Other	OPEN GYM	2025-08-07 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4314	Other	OPEN GYM	2025-08-14 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4315	Other	OPEN GYM	2025-08-21 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4316	Other	OPEN GYM	2025-08-28 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4317	Other	OPEN GYM	2025-09-04 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4318	Other	OPEN GYM	2025-09-11 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4319	Other	OPEN GYM	2025-09-18 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4320	Other	OPEN GYM	2025-09-25 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4321	Other	OPEN GYM	2025-10-02 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4322	Other	OPEN GYM	2025-10-09 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4323	Other	OPEN GYM	2025-10-16 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4324	Other	OPEN GYM	2025-10-23 12:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4325	Other	OPEN GYM	2025-10-30 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4326	Other	OPEN GYM	2025-11-06 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4327	Other	OPEN GYM	2025-11-13 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4328	Other	OPEN GYM	2025-11-20 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4329	Other	OPEN GYM	2025-11-27 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4330	Other	OPEN GYM	2025-12-04 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4331	Other	OPEN GYM	2025-12-11 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4332	Other	OPEN GYM	2025-12-18 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4333	Other	OPEN GYM	2025-12-25 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4334	Other	OPEN GYM	2026-01-01 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4335	Other	OPEN GYM	2026-01-08 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4336	Other	OPEN GYM	2026-01-15 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4337	Other	OPEN GYM	2026-01-22 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4338	Other	OPEN GYM	2026-01-29 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4339	Other	OPEN GYM	2026-02-05 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4340	Other	OPEN GYM	2026-02-12 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4341	Other	OPEN GYM	2026-02-19 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4342	Other	OPEN GYM	2026-02-26 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4343	Other	OPEN GYM	2026-03-05 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4344	Other	OPEN GYM	2026-03-12 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4345	Other	OPEN GYM	2026-03-19 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4346	Other	OPEN GYM	2026-03-26 13:00:00	120	Tarvi Torn	10		t	2	2	4294	\N	\N	\N	t	f
4347	Other	OPEN GYM	2025-03-28 13:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4348	Other	OPEN GYM	2025-04-04 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4349	Other	OPEN GYM	2025-04-11 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4350	Other	OPEN GYM	2025-04-18 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4135	Other	OPEN GYM	2025-03-24 13:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4136	Other	OPEN GYM	2025-03-31 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4137	Other	OPEN GYM	2025-04-07 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4138	Other	OPEN GYM	2025-04-14 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4139	Other	OPEN GYM	2025-04-21 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4140	Other	OPEN GYM	2025-04-28 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4141	Other	OPEN GYM	2025-05-05 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4142	Other	OPEN GYM	2025-05-12 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4143	Other	OPEN GYM	2025-05-19 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4144	Other	OPEN GYM	2025-05-26 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4145	Other	OPEN GYM	2025-06-02 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4146	Other	OPEN GYM	2025-06-09 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4147	Other	OPEN GYM	2025-06-16 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4148	Other	OPEN GYM	2025-06-23 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4149	Other	OPEN GYM	2025-06-30 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4150	Other	OPEN GYM	2025-07-07 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4151	Other	OPEN GYM	2025-07-14 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4152	Other	OPEN GYM	2025-07-21 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4153	Other	OPEN GYM	2025-07-28 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4154	Other	OPEN GYM	2025-08-04 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4155	Other	OPEN GYM	2025-08-11 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4156	Other	OPEN GYM	2025-08-18 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4157	Other	OPEN GYM	2025-08-25 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4158	Other	OPEN GYM	2025-09-01 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4159	Other	OPEN GYM	2025-09-08 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4160	Other	OPEN GYM	2025-09-15 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4161	Other	OPEN GYM	2025-09-22 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4162	Other	OPEN GYM	2025-09-29 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4163	Other	OPEN GYM	2025-10-06 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4164	Other	OPEN GYM	2025-10-13 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4165	Other	OPEN GYM	2025-10-20 12:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4166	Other	OPEN GYM	2025-10-27 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4167	Other	OPEN GYM	2025-11-03 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4168	Other	OPEN GYM	2025-11-10 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4169	Other	OPEN GYM	2025-11-17 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4170	Other	OPEN GYM	2025-11-24 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4171	Other	OPEN GYM	2025-12-01 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4172	Other	OPEN GYM	2025-12-08 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4173	Other	OPEN GYM	2025-12-15 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4174	Other	OPEN GYM	2025-12-22 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4175	Other	OPEN GYM	2025-12-29 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4176	Other	OPEN GYM	2026-01-05 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4177	Other	OPEN GYM	2026-01-12 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4178	Other	OPEN GYM	2026-01-19 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4179	Other	OPEN GYM	2026-01-26 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4180	Other	OPEN GYM	2026-02-02 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4181	Other	OPEN GYM	2026-02-09 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4182	Other	OPEN GYM	2026-02-16 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4183	Other	OPEN GYM	2026-02-23 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4184	Other	OPEN GYM	2026-03-02 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4185	Other	OPEN GYM	2026-03-09 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4186	Other	OPEN GYM	2026-03-16 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4187	Other	OPEN GYM	2026-03-23 13:00:00	120	Tarvi Torn	10		t	2	2	4135	\N	\N	\N	t	f
4188	Other	OPEN GYM	2025-03-25 13:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4189	Other	OPEN GYM	2025-04-01 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4190	Other	OPEN GYM	2025-04-08 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4191	Other	OPEN GYM	2025-04-15 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4192	Other	OPEN GYM	2025-04-22 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4193	Other	OPEN GYM	2025-04-29 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4194	Other	OPEN GYM	2025-05-06 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4195	Other	OPEN GYM	2025-05-13 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4196	Other	OPEN GYM	2025-05-20 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4197	Other	OPEN GYM	2025-05-27 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4198	Other	OPEN GYM	2025-06-03 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4199	Other	OPEN GYM	2025-06-10 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4200	Other	OPEN GYM	2025-06-17 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4201	Other	OPEN GYM	2025-06-24 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4202	Other	OPEN GYM	2025-07-01 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4203	Other	OPEN GYM	2025-07-08 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4204	Other	OPEN GYM	2025-07-15 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4205	Other	OPEN GYM	2025-07-22 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4206	Other	OPEN GYM	2025-07-29 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4207	Other	OPEN GYM	2025-08-05 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4208	Other	OPEN GYM	2025-08-12 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4209	Other	OPEN GYM	2025-08-19 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4210	Other	OPEN GYM	2025-08-26 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4211	Other	OPEN GYM	2025-09-02 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4212	Other	OPEN GYM	2025-09-09 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4213	Other	OPEN GYM	2025-09-16 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4214	Other	OPEN GYM	2025-09-23 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4215	Other	OPEN GYM	2025-09-30 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4216	Other	OPEN GYM	2025-10-07 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4217	Other	OPEN GYM	2025-10-14 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4218	Other	OPEN GYM	2025-10-21 12:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4219	Other	OPEN GYM	2025-10-28 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4220	Other	OPEN GYM	2025-11-04 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4221	Other	OPEN GYM	2025-11-11 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4222	Other	OPEN GYM	2025-11-18 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4223	Other	OPEN GYM	2025-11-25 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4224	Other	OPEN GYM	2025-12-02 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4225	Other	OPEN GYM	2025-12-09 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4226	Other	OPEN GYM	2025-12-16 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4227	Other	OPEN GYM	2025-12-23 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4228	Other	OPEN GYM	2025-12-30 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4229	Other	OPEN GYM	2026-01-06 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4230	Other	OPEN GYM	2026-01-13 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4231	Other	OPEN GYM	2026-01-20 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4232	Other	OPEN GYM	2026-01-27 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4233	Other	OPEN GYM	2026-02-03 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4234	Other	OPEN GYM	2026-02-10 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4235	Other	OPEN GYM	2026-02-17 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4236	Other	OPEN GYM	2026-02-24 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4237	Other	OPEN GYM	2026-03-03 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4238	Other	OPEN GYM	2026-03-10 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4239	Other	OPEN GYM	2026-03-17 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4240	Other	OPEN GYM	2026-03-24 13:00:00	120	Tarvi Torn	10		t	2	2	4188	\N	\N	\N	t	f
4241	Other	OPEN GYM	2025-03-26 13:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4242	Other	OPEN GYM	2025-04-02 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4243	Other	OPEN GYM	2025-04-09 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4244	Other	OPEN GYM	2025-04-16 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4245	Other	OPEN GYM	2025-04-23 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4246	Other	OPEN GYM	2025-04-30 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4247	Other	OPEN GYM	2025-05-07 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4248	Other	OPEN GYM	2025-05-14 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4249	Other	OPEN GYM	2025-05-21 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4250	Other	OPEN GYM	2025-05-28 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4251	Other	OPEN GYM	2025-06-04 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4252	Other	OPEN GYM	2025-06-11 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4253	Other	OPEN GYM	2025-06-18 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4254	Other	OPEN GYM	2025-06-25 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4255	Other	OPEN GYM	2025-07-02 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4256	Other	OPEN GYM	2025-07-09 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4257	Other	OPEN GYM	2025-07-16 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4258	Other	OPEN GYM	2025-07-23 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4259	Other	OPEN GYM	2025-07-30 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4260	Other	OPEN GYM	2025-08-06 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4261	Other	OPEN GYM	2025-08-13 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4262	Other	OPEN GYM	2025-08-20 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4263	Other	OPEN GYM	2025-08-27 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4264	Other	OPEN GYM	2025-09-03 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4265	Other	OPEN GYM	2025-09-10 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4266	Other	OPEN GYM	2025-09-17 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4267	Other	OPEN GYM	2025-09-24 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4268	Other	OPEN GYM	2025-10-01 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4269	Other	OPEN GYM	2025-10-08 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4270	Other	OPEN GYM	2025-10-15 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4271	Other	OPEN GYM	2025-10-22 12:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4272	Other	OPEN GYM	2025-10-29 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4273	Other	OPEN GYM	2025-11-05 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4274	Other	OPEN GYM	2025-11-12 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4275	Other	OPEN GYM	2025-11-19 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4276	Other	OPEN GYM	2025-11-26 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4277	Other	OPEN GYM	2025-12-03 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4278	Other	OPEN GYM	2025-12-10 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4279	Other	OPEN GYM	2025-12-17 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4280	Other	OPEN GYM	2025-12-24 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4281	Other	OPEN GYM	2025-12-31 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4282	Other	OPEN GYM	2026-01-07 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4283	Other	OPEN GYM	2026-01-14 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4284	Other	OPEN GYM	2026-01-21 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4285	Other	OPEN GYM	2026-01-28 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4286	Other	OPEN GYM	2026-02-04 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4287	Other	OPEN GYM	2026-02-11 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4288	Other	OPEN GYM	2026-02-18 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4289	Other	OPEN GYM	2026-02-25 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4290	Other	OPEN GYM	2026-03-04 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4291	Other	OPEN GYM	2026-03-11 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4292	Other	OPEN GYM	2026-03-18 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4293	Other	OPEN GYM	2026-03-25 13:00:00	120	Tarvi Torn	10		t	2	2	4241	\N	\N	\N	t	f
4351	Other	OPEN GYM	2025-04-25 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4352	Other	OPEN GYM	2025-05-02 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4353	Other	OPEN GYM	2025-05-09 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4354	Other	OPEN GYM	2025-05-16 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4355	Other	OPEN GYM	2025-05-23 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4356	Other	OPEN GYM	2025-05-30 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4357	Other	OPEN GYM	2025-06-06 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4358	Other	OPEN GYM	2025-06-13 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4359	Other	OPEN GYM	2025-06-20 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4360	Other	OPEN GYM	2025-06-27 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4361	Other	OPEN GYM	2025-07-04 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4362	Other	OPEN GYM	2025-07-11 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4363	Other	OPEN GYM	2025-07-18 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4364	Other	OPEN GYM	2025-07-25 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4365	Other	OPEN GYM	2025-08-01 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4366	Other	OPEN GYM	2025-08-08 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4367	Other	OPEN GYM	2025-08-15 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4368	Other	OPEN GYM	2025-08-22 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4369	Other	OPEN GYM	2025-08-29 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4370	Other	OPEN GYM	2025-09-05 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4371	Other	OPEN GYM	2025-09-12 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4372	Other	OPEN GYM	2025-09-19 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4373	Other	OPEN GYM	2025-09-26 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4374	Other	OPEN GYM	2025-10-03 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4375	Other	OPEN GYM	2025-10-10 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4376	Other	OPEN GYM	2025-10-17 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4377	Other	OPEN GYM	2025-10-24 12:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4378	Other	OPEN GYM	2025-10-31 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4379	Other	OPEN GYM	2025-11-07 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4380	Other	OPEN GYM	2025-11-14 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4381	Other	OPEN GYM	2025-11-21 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4382	Other	OPEN GYM	2025-11-28 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4383	Other	OPEN GYM	2025-12-05 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4384	Other	OPEN GYM	2025-12-12 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4385	Other	OPEN GYM	2025-12-19 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4386	Other	OPEN GYM	2025-12-26 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4387	Other	OPEN GYM	2026-01-02 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4388	Other	OPEN GYM	2026-01-09 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4389	Other	OPEN GYM	2026-01-16 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4390	Other	OPEN GYM	2026-01-23 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4391	Other	OPEN GYM	2026-01-30 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4392	Other	OPEN GYM	2026-02-06 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4393	Other	OPEN GYM	2026-02-13 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4394	Other	OPEN GYM	2026-02-20 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4395	Other	OPEN GYM	2026-02-27 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4396	Other	OPEN GYM	2026-03-06 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4397	Other	OPEN GYM	2026-03-13 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4398	Other	OPEN GYM	2026-03-20 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4399	Other	OPEN GYM	2026-03-27 13:00:00	120	Tarvi Torn	10		t	2	2	4347	\N	\N	\N	t	f
4400	Other	OPEN GYM	2025-03-24 15:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4401	Other	OPEN GYM	2025-03-31 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4402	Other	OPEN GYM	2025-04-07 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4403	Other	OPEN GYM	2025-04-14 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4404	Other	OPEN GYM	2025-04-21 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4405	Other	OPEN GYM	2025-04-28 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4406	Other	OPEN GYM	2025-05-05 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4407	Other	OPEN GYM	2025-05-12 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4408	Other	OPEN GYM	2025-05-19 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4409	Other	OPEN GYM	2025-05-26 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4410	Other	OPEN GYM	2025-06-02 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4411	Other	OPEN GYM	2025-06-09 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4412	Other	OPEN GYM	2025-06-16 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4413	Other	OPEN GYM	2025-06-23 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4414	Other	OPEN GYM	2025-06-30 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4415	Other	OPEN GYM	2025-07-07 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4416	Other	OPEN GYM	2025-07-14 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4417	Other	OPEN GYM	2025-07-21 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4418	Other	OPEN GYM	2025-07-28 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4419	Other	OPEN GYM	2025-08-04 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4420	Other	OPEN GYM	2025-08-11 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4421	Other	OPEN GYM	2025-08-18 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4422	Other	OPEN GYM	2025-08-25 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4423	Other	OPEN GYM	2025-09-01 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4424	Other	OPEN GYM	2025-09-08 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4425	Other	OPEN GYM	2025-09-15 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4426	Other	OPEN GYM	2025-09-22 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4427	Other	OPEN GYM	2025-09-29 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4428	Other	OPEN GYM	2025-10-06 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4429	Other	OPEN GYM	2025-10-13 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4430	Other	OPEN GYM	2025-10-20 14:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4431	Other	OPEN GYM	2025-10-27 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4432	Other	OPEN GYM	2025-11-03 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4433	Other	OPEN GYM	2025-11-10 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4434	Other	OPEN GYM	2025-11-17 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4435	Other	OPEN GYM	2025-11-24 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4436	Other	OPEN GYM	2025-12-01 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4437	Other	OPEN GYM	2025-12-08 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4438	Other	OPEN GYM	2025-12-15 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4439	Other	OPEN GYM	2025-12-22 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4440	Other	OPEN GYM	2025-12-29 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4441	Other	OPEN GYM	2026-01-05 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4442	Other	OPEN GYM	2026-01-12 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4443	Other	OPEN GYM	2026-01-19 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4444	Other	OPEN GYM	2026-01-26 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4445	Other	OPEN GYM	2026-02-02 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4446	Other	OPEN GYM	2026-02-09 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4447	Other	OPEN GYM	2026-02-16 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4448	Other	OPEN GYM	2026-02-23 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4449	Other	OPEN GYM	2026-03-02 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4450	Other	OPEN GYM	2026-03-09 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4451	Other	OPEN GYM	2026-03-16 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4452	Other	OPEN GYM	2026-03-23 15:00:00	120	Tarvi Torn	10		t	2	2	4400	\N	\N	\N	t	f
4453	Other	OPEN GYM	2025-03-25 15:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4454	Other	OPEN GYM	2025-04-01 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4455	Other	OPEN GYM	2025-04-08 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4456	Other	OPEN GYM	2025-04-15 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4457	Other	OPEN GYM	2025-04-22 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4458	Other	OPEN GYM	2025-04-29 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4459	Other	OPEN GYM	2025-05-06 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4460	Other	OPEN GYM	2025-05-13 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4461	Other	OPEN GYM	2025-05-20 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4462	Other	OPEN GYM	2025-05-27 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4463	Other	OPEN GYM	2025-06-03 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4464	Other	OPEN GYM	2025-06-10 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4465	Other	OPEN GYM	2025-06-17 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4466	Other	OPEN GYM	2025-06-24 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4467	Other	OPEN GYM	2025-07-01 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4468	Other	OPEN GYM	2025-07-08 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4469	Other	OPEN GYM	2025-07-15 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4470	Other	OPEN GYM	2025-07-22 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4471	Other	OPEN GYM	2025-07-29 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4472	Other	OPEN GYM	2025-08-05 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4473	Other	OPEN GYM	2025-08-12 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4474	Other	OPEN GYM	2025-08-19 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4475	Other	OPEN GYM	2025-08-26 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4476	Other	OPEN GYM	2025-09-02 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4477	Other	OPEN GYM	2025-09-09 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4478	Other	OPEN GYM	2025-09-16 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4479	Other	OPEN GYM	2025-09-23 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4480	Other	OPEN GYM	2025-09-30 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4481	Other	OPEN GYM	2025-10-07 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4482	Other	OPEN GYM	2025-10-14 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4483	Other	OPEN GYM	2025-10-21 14:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4484	Other	OPEN GYM	2025-10-28 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4485	Other	OPEN GYM	2025-11-04 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4486	Other	OPEN GYM	2025-11-11 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4487	Other	OPEN GYM	2025-11-18 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4488	Other	OPEN GYM	2025-11-25 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4489	Other	OPEN GYM	2025-12-02 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4490	Other	OPEN GYM	2025-12-09 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4491	Other	OPEN GYM	2025-12-16 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4492	Other	OPEN GYM	2025-12-23 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4493	Other	OPEN GYM	2025-12-30 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4494	Other	OPEN GYM	2026-01-06 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4495	Other	OPEN GYM	2026-01-13 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4496	Other	OPEN GYM	2026-01-20 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4497	Other	OPEN GYM	2026-01-27 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4498	Other	OPEN GYM	2026-02-03 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4499	Other	OPEN GYM	2026-02-10 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4500	Other	OPEN GYM	2026-02-17 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4501	Other	OPEN GYM	2026-02-24 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4502	Other	OPEN GYM	2026-03-03 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4503	Other	OPEN GYM	2026-03-10 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4504	Other	OPEN GYM	2026-03-17 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4505	Other	OPEN GYM	2026-03-24 15:00:00	120	Tarvi Torn	10		t	2	2	4453	\N	\N	\N	t	f
4506	Other	OPEN GYM	2025-03-26 15:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4507	Other	OPEN GYM	2025-04-02 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4508	Other	OPEN GYM	2025-04-09 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4509	Other	OPEN GYM	2025-04-16 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4510	Other	OPEN GYM	2025-04-23 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4511	Other	OPEN GYM	2025-04-30 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4512	Other	OPEN GYM	2025-05-07 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4513	Other	OPEN GYM	2025-05-14 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4514	Other	OPEN GYM	2025-05-21 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4515	Other	OPEN GYM	2025-05-28 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4516	Other	OPEN GYM	2025-06-04 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4517	Other	OPEN GYM	2025-06-11 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4518	Other	OPEN GYM	2025-06-18 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4519	Other	OPEN GYM	2025-06-25 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4520	Other	OPEN GYM	2025-07-02 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4521	Other	OPEN GYM	2025-07-09 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4522	Other	OPEN GYM	2025-07-16 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4523	Other	OPEN GYM	2025-07-23 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4524	Other	OPEN GYM	2025-07-30 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4525	Other	OPEN GYM	2025-08-06 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4526	Other	OPEN GYM	2025-08-13 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4527	Other	OPEN GYM	2025-08-20 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4528	Other	OPEN GYM	2025-08-27 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4529	Other	OPEN GYM	2025-09-03 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4530	Other	OPEN GYM	2025-09-10 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4531	Other	OPEN GYM	2025-09-17 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4532	Other	OPEN GYM	2025-09-24 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4533	Other	OPEN GYM	2025-10-01 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4534	Other	OPEN GYM	2025-10-08 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4535	Other	OPEN GYM	2025-10-15 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4536	Other	OPEN GYM	2025-10-22 14:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4537	Other	OPEN GYM	2025-10-29 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4538	Other	OPEN GYM	2025-11-05 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4539	Other	OPEN GYM	2025-11-12 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4540	Other	OPEN GYM	2025-11-19 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4541	Other	OPEN GYM	2025-11-26 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4542	Other	OPEN GYM	2025-12-03 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4543	Other	OPEN GYM	2025-12-10 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4544	Other	OPEN GYM	2025-12-17 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4545	Other	OPEN GYM	2025-12-24 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4546	Other	OPEN GYM	2025-12-31 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4547	Other	OPEN GYM	2026-01-07 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4548	Other	OPEN GYM	2026-01-14 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4549	Other	OPEN GYM	2026-01-21 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4550	Other	OPEN GYM	2026-01-28 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4551	Other	OPEN GYM	2026-02-04 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4552	Other	OPEN GYM	2026-02-11 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4553	Other	OPEN GYM	2026-02-18 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4554	Other	OPEN GYM	2026-02-25 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4555	Other	OPEN GYM	2026-03-04 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4556	Other	OPEN GYM	2026-03-11 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4557	Other	OPEN GYM	2026-03-18 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4558	Other	OPEN GYM	2026-03-25 15:00:00	120	Tarvi Torn	10		t	2	2	4506	\N	\N	\N	t	f
4559	Other	OPEN GYM	2025-03-27 15:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4560	Other	OPEN GYM	2025-04-03 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4561	Other	OPEN GYM	2025-04-10 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4562	Other	OPEN GYM	2025-04-17 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4563	Other	OPEN GYM	2025-04-24 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4564	Other	OPEN GYM	2025-05-01 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4565	Other	OPEN GYM	2025-05-08 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4566	Other	OPEN GYM	2025-05-15 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4567	Other	OPEN GYM	2025-05-22 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4568	Other	OPEN GYM	2025-05-29 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4569	Other	OPEN GYM	2025-06-05 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4570	Other	OPEN GYM	2025-06-12 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4571	Other	OPEN GYM	2025-06-19 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4572	Other	OPEN GYM	2025-06-26 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4573	Other	OPEN GYM	2025-07-03 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4574	Other	OPEN GYM	2025-07-10 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4575	Other	OPEN GYM	2025-07-17 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4576	Other	OPEN GYM	2025-07-24 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4577	Other	OPEN GYM	2025-07-31 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4578	Other	OPEN GYM	2025-08-07 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4579	Other	OPEN GYM	2025-08-14 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4580	Other	OPEN GYM	2025-08-21 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4581	Other	OPEN GYM	2025-08-28 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4582	Other	OPEN GYM	2025-09-04 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4583	Other	OPEN GYM	2025-09-11 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4584	Other	OPEN GYM	2025-09-18 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4585	Other	OPEN GYM	2025-09-25 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4586	Other	OPEN GYM	2025-10-02 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4587	Other	OPEN GYM	2025-10-09 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4588	Other	OPEN GYM	2025-10-16 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4589	Other	OPEN GYM	2025-10-23 14:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4590	Other	OPEN GYM	2025-10-30 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4591	Other	OPEN GYM	2025-11-06 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4592	Other	OPEN GYM	2025-11-13 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4593	Other	OPEN GYM	2025-11-20 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4594	Other	OPEN GYM	2025-11-27 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4595	Other	OPEN GYM	2025-12-04 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4596	Other	OPEN GYM	2025-12-11 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4597	Other	OPEN GYM	2025-12-18 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4598	Other	OPEN GYM	2025-12-25 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4599	Other	OPEN GYM	2026-01-01 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4600	Other	OPEN GYM	2026-01-08 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4601	Other	OPEN GYM	2026-01-15 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4602	Other	OPEN GYM	2026-01-22 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4603	Other	OPEN GYM	2026-01-29 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4604	Other	OPEN GYM	2026-02-05 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4605	Other	OPEN GYM	2026-02-12 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4606	Other	OPEN GYM	2026-02-19 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4607	Other	OPEN GYM	2026-02-26 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4608	Other	OPEN GYM	2026-03-05 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4609	Other	OPEN GYM	2026-03-12 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4610	Other	OPEN GYM	2026-03-19 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4611	Other	OPEN GYM	2026-03-26 15:00:00	120	Tarvi Torn	10		t	2	2	4559	\N	\N	\N	t	f
4612	Other	OPEN GYM	2025-03-28 15:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4613	Other	OPEN GYM	2025-04-04 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4614	Other	OPEN GYM	2025-04-11 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4615	Other	OPEN GYM	2025-04-18 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4616	Other	OPEN GYM	2025-04-25 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4617	Other	OPEN GYM	2025-05-02 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4618	Other	OPEN GYM	2025-05-09 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4619	Other	OPEN GYM	2025-05-16 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4620	Other	OPEN GYM	2025-05-23 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4621	Other	OPEN GYM	2025-05-30 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4622	Other	OPEN GYM	2025-06-06 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4623	Other	OPEN GYM	2025-06-13 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4624	Other	OPEN GYM	2025-06-20 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4625	Other	OPEN GYM	2025-06-27 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4626	Other	OPEN GYM	2025-07-04 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4627	Other	OPEN GYM	2025-07-11 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4628	Other	OPEN GYM	2025-07-18 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4629	Other	OPEN GYM	2025-07-25 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4630	Other	OPEN GYM	2025-08-01 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4631	Other	OPEN GYM	2025-08-08 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4632	Other	OPEN GYM	2025-08-15 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4633	Other	OPEN GYM	2025-08-22 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4634	Other	OPEN GYM	2025-08-29 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4635	Other	OPEN GYM	2025-09-05 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4636	Other	OPEN GYM	2025-09-12 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4637	Other	OPEN GYM	2025-09-19 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4638	Other	OPEN GYM	2025-09-26 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4639	Other	OPEN GYM	2025-10-03 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4640	Other	OPEN GYM	2025-10-10 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4641	Other	OPEN GYM	2025-10-17 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4642	Other	OPEN GYM	2025-10-24 14:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4643	Other	OPEN GYM	2025-10-31 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4644	Other	OPEN GYM	2025-11-07 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4645	Other	OPEN GYM	2025-11-14 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4646	Other	OPEN GYM	2025-11-21 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4647	Other	OPEN GYM	2025-11-28 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4648	Other	OPEN GYM	2025-12-05 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4649	Other	OPEN GYM	2025-12-12 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4650	Other	OPEN GYM	2025-12-19 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4651	Other	OPEN GYM	2025-12-26 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4652	Other	OPEN GYM	2026-01-02 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4653	Other	OPEN GYM	2026-01-09 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4654	Other	OPEN GYM	2026-01-16 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4655	Other	OPEN GYM	2026-01-23 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4656	Other	OPEN GYM	2026-01-30 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4657	Other	OPEN GYM	2026-02-06 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4658	Other	OPEN GYM	2026-02-13 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4659	Other	OPEN GYM	2026-02-20 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4660	Other	OPEN GYM	2026-02-27 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4661	Other	OPEN GYM	2026-03-06 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4662	Other	OPEN GYM	2026-03-13 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4663	Other	OPEN GYM	2026-03-20 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4664	Other	OPEN GYM	2026-03-27 15:00:00	120	Tarvi Torn	10		t	2	2	4612	\N	\N	\N	t	f
4665	Other	OPEN GYM	2025-03-29 08:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4666	Other	OPEN GYM	2025-04-05 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4667	Other	OPEN GYM	2025-04-12 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4668	Other	OPEN GYM	2025-04-19 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4669	Other	OPEN GYM	2025-04-26 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4670	Other	OPEN GYM	2025-05-03 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4671	Other	OPEN GYM	2025-05-10 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4672	Other	OPEN GYM	2025-05-17 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4673	Other	OPEN GYM	2025-05-24 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4674	Other	OPEN GYM	2025-05-31 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4675	Other	OPEN GYM	2025-06-07 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4676	Other	OPEN GYM	2025-06-14 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4677	Other	OPEN GYM	2025-06-21 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4678	Other	OPEN GYM	2025-06-28 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4679	Other	OPEN GYM	2025-07-05 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4680	Other	OPEN GYM	2025-07-12 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4681	Other	OPEN GYM	2025-07-19 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4682	Other	OPEN GYM	2025-07-26 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4683	Other	OPEN GYM	2025-08-02 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4684	Other	OPEN GYM	2025-08-09 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4685	Other	OPEN GYM	2025-08-16 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4686	Other	OPEN GYM	2025-08-23 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4687	Other	OPEN GYM	2025-08-30 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4688	Other	OPEN GYM	2025-09-06 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4689	Other	OPEN GYM	2025-09-13 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4690	Other	OPEN GYM	2025-09-20 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4691	Other	OPEN GYM	2025-09-27 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4692	Other	OPEN GYM	2025-10-04 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4693	Other	OPEN GYM	2025-10-11 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4694	Other	OPEN GYM	2025-10-18 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4695	Other	OPEN GYM	2025-10-25 07:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4696	Other	OPEN GYM	2025-11-01 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4697	Other	OPEN GYM	2025-11-08 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4698	Other	OPEN GYM	2025-11-15 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4699	Other	OPEN GYM	2025-11-22 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4700	Other	OPEN GYM	2025-11-29 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4701	Other	OPEN GYM	2025-12-06 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4702	Other	OPEN GYM	2025-12-13 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4703	Other	OPEN GYM	2025-12-20 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4704	Other	OPEN GYM	2025-12-27 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4705	Other	OPEN GYM	2026-01-03 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4706	Other	OPEN GYM	2026-01-10 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4707	Other	OPEN GYM	2026-01-17 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4708	Other	OPEN GYM	2026-01-24 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4709	Other	OPEN GYM	2026-01-31 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4710	Other	OPEN GYM	2026-02-07 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4711	Other	OPEN GYM	2026-02-14 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4712	Other	OPEN GYM	2026-02-21 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4713	Other	OPEN GYM	2026-02-28 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4714	Other	OPEN GYM	2026-03-07 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4715	Other	OPEN GYM	2026-03-14 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4716	Other	OPEN GYM	2026-03-21 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4717	Other	OPEN GYM	2026-03-28 08:00:00	120	Tarvi Torn	10		t	2	2	4665	\N	\N	\N	t	f
4718	Other	OPEN GYM	2025-03-30 13:00:00	120	Tarvi Torn	10		t	2	2	\N		For Time	\N	t	f
4719	Other	OPEN GYM	2025-04-06 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4720	Other	OPEN GYM	2025-04-13 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4721	Other	OPEN GYM	2025-04-20 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4722	Other	OPEN GYM	2025-04-27 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4723	Other	OPEN GYM	2025-05-04 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4724	Other	OPEN GYM	2025-05-11 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4725	Other	OPEN GYM	2025-05-18 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4726	Other	OPEN GYM	2025-05-25 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4727	Other	OPEN GYM	2025-06-01 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4728	Other	OPEN GYM	2025-06-08 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4729	Other	OPEN GYM	2025-06-15 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4730	Other	OPEN GYM	2025-06-22 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4731	Other	OPEN GYM	2025-06-29 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4732	Other	OPEN GYM	2025-07-06 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4733	Other	OPEN GYM	2025-07-13 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4734	Other	OPEN GYM	2025-07-20 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4735	Other	OPEN GYM	2025-07-27 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4736	Other	OPEN GYM	2025-08-03 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4737	Other	OPEN GYM	2025-08-10 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4738	Other	OPEN GYM	2025-08-17 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4739	Other	OPEN GYM	2025-08-24 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4740	Other	OPEN GYM	2025-08-31 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4741	Other	OPEN GYM	2025-09-07 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4742	Other	OPEN GYM	2025-09-14 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4743	Other	OPEN GYM	2025-09-21 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4744	Other	OPEN GYM	2025-09-28 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4745	Other	OPEN GYM	2025-10-05 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4746	Other	OPEN GYM	2025-10-12 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4747	Other	OPEN GYM	2025-10-19 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4748	Other	OPEN GYM	2025-10-26 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4749	Other	OPEN GYM	2025-11-02 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4750	Other	OPEN GYM	2025-11-09 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4751	Other	OPEN GYM	2025-11-16 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4752	Other	OPEN GYM	2025-11-23 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4753	Other	OPEN GYM	2025-11-30 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4754	Other	OPEN GYM	2025-12-07 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4755	Other	OPEN GYM	2025-12-14 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4756	Other	OPEN GYM	2025-12-21 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4757	Other	OPEN GYM	2025-12-28 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4758	Other	OPEN GYM	2026-01-04 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4759	Other	OPEN GYM	2026-01-11 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4760	Other	OPEN GYM	2026-01-18 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4761	Other	OPEN GYM	2026-01-25 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4762	Other	OPEN GYM	2026-02-01 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4763	Other	OPEN GYM	2026-02-08 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4764	Other	OPEN GYM	2026-02-15 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4765	Other	OPEN GYM	2026-02-22 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4766	Other	OPEN GYM	2026-03-01 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4767	Other	OPEN GYM	2026-03-08 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4768	Other	OPEN GYM	2026-03-15 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4769	Other	OPEN GYM	2026-03-22 14:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
4770	Other	OPEN GYM	2026-03-29 13:00:00	120	Tarvi Torn	10		t	2	2	4718	\N	\N	\N	t	f
2174	WOD	CROSSFIT	2025-03-24 10:18:00	60	Karl Sasi	12	Must saal	t	2	2	\N		For Time	\N	t	f
\.


--
-- Data for Name: Contract; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."Contract" (id, "affiliateId", "userId", "contractType", content, "paymentType", "paymentAmount", "paymentInterval", "paymentDay", "validUntil", active, status, "createdAt", "acceptedAt") FROM stdin;
2	1	4	Monthly Membership	Leping nr [X]\nSõlmitud: [kuupäev]\n\nLepingupooled:\n\nCrossFit Viljandi\n\nOmanik: Mihekl\nAsukoht: \nedaspidi „Teenusepakkuja” või „Affiliate“\n[Kliendi nimi ja isikukood]\n\n[Kontaktandmed: aadress, telefon, e-post]\nedaspidi „Klient”\n1. Lepingu ese\n1.1 Käesoleva lepingu esemeks on CrossFit Tartu poolt pakutavate treeningvõimaluste, sh rühmatreeningute, iseseisva treeningu ja muude seotud teenuste kasutamise õigus.\n1.2 Leping on tähtajatu ning Klient võib tasu eest kasutada Teenusepakkuja treeningteenuseid käesolevas lepingus sätestatud tingimustel.\n\n2. Liikmemaks ja maksetingimused\n2.1 Klient kohustub tasuma igakuist liikmemaksu summas [X eurot].\n2.2 Liikmemaks kuulub tasumisele hiljemalt iga kuu 15. kuupäevaks.\n2.3 Maksetingimused (sh arveldusarve number, selgitus jms) määratakse Teenusepakkuja poolt. Klient vastutab õigeaegse ning õige viitenumbriga tasumise eest.\n2.4 Viivitusintressi või leppetrahvi võidakse rakendada vastavalt Teenusepakkuja kehtestatud üldtingimustele, kui Klient ei ole kokkulepitud tähtpäevaks liikmemaksu tasunud. Teenusepakkuja võib samuti peatada Kliendi treeninguõiguse, kuni võlgnevus on tasutud.\n\n3. Teenuste kasutamine\n3.1 Klient on kohustatud tutvuma CrossFit Tartu sisekorraeeskirjadega (sh turvalisus, hügieen, treeningute registreerimine, tühistamise kord jms) ja neid täitma.\n3.2 Teenusepakkujal on õigus ajutiselt piirata treeningute või ruumide kasutamist seoses remondi, hooldustööde või muude etteplaneeritud tegevustega, teavitades sellest mõistliku aja jooksul ette.\n3.3 Teenusepakkuja võib teha muudatusi treeningute ajakavas, hinnakirjas või sisukorras, teavitades sellest Kliendi e-posti või veebilehe vahendusel. Oluliste muudatuste puhul on Kliendil õigus leping üles öelda, teatades sellest 14 päeva ette.\n\n4. Lepingu kestus ja lõpetamine\n4.1 Leping jõustub selle allkirjastamisest (või digiallkirjast) ning on sõlmitud tähtajatult.\n4.2 Klient võib lepingu igal ajal üles öelda, esitades Teenusepakkujale kirjaliku (või digitaalse) avalduse. Lepingu lõppemisest tulenevalt arvestatakse liikmemaks proportsionaalselt selle kuu kasutusajaga või vastavalt Teenusepakkuja üldtingimustele.\n4.3 Teenusepakkuja võib lepingu erakorraliselt lõpetada, kui Klient on oluliselt lepingut rikkunud (näiteks korduv makseviivitus või sisekorraeeskirjade rikkumine).\n\n5. Vastutus ja pretensioonid\n5.1 Teenusepakkuja vastutab Kliendi ees üksnes siis, kui kahju või kahjustus on põhjustatud Teenusepakkuja raskest hooletusest või tahtlikust tegevusest.\n5.2 Klient vastutab oma tervisliku seisundi eest ning on kohustatud veenduma, et tal pole vastunäidustusi treeningutes osalemiseks.\n5.3 Kui Kliendil on kaebusi või pretensioone, lahendatakse need esmalt heas usus läbirääkimiste teel. Vaidluste jätkumisel on Kliendil õigus pöörduda Tarbijakaitse ja Tehnilise Järelevalve Ameti või kohtusse vastavalt Eesti Vabariigi seadustele.\n\n6. Isikuandmete kaitse ja GDPR\n6.1 Teenusepakkuja töötleb Kliendi isikuandmeid (nt nimi, kontaktandmed, makseinfo) üksnes teenuste osutamiseks, lepingu täitmiseks, raamatupidamis- või juriidiliste kohustuste täitmiseks vastavalt Euroopa Liidu isikuandmete kaitse üldmäärusele (GDPR) ja Eesti seadustele.\n6.2 Klient võib igal ajal küsida teavet enda isikuandmete töötlemise kohta ning taotleda parandamist, kustutamist või töötlemise piiramist, kui see ei ole vastuolus seadusest tulenevate kohustustega.\n\n7. Muud tingimused\n7.1 Poolte vahelised teated loetakse kehtivaks, kui need on edastatud e-posti teel, kirjalikult või muus tõendatavas vormis.\n7.2 Kõik lepingus puuduvad küsimused ja suhted lahendatakse vastavalt Eesti Vabariigi kehtivatele õigusaktidele.\n7.3 Kokkuleppe muutmine või täiendamine toimub kirjalikult või digiallkirjastatud lisakokkuleppega.\n\n8. Allkirjastamine ja jõustumine\n8.1 Klient kinnitab, et on käesoleva lepingu ja teenusepakkuja Terms and Conditions (üldtingimuste) sisust aru saanud ning nõustub nendega.\n8.2 Leping loetakse sõlmituks ning õiguslikult siduvaks hetkest, mil Klient on lepingu allkirjastanud (sh digiallkirjastanud) või klõpsanud „Accept” (nõustun) nuppu.\n\nPOOLTE ALLEKIRJAD\n\nCrossFit\n(omanik i)\nAllkiri: …………………….. Kuupäev: ………………\n\nKlient\n[nimi ja isikukood]\nAllkiri: …………………….. Kuupäev: ………………		75	month	28	2028-10-15 00:00:00	t	accepted	2025-03-22 17:26:57.454	2025-03-22 18:36:17.162
1	2	3	Monthly Membership	Leping nr [X]\nSõlmitud: [kuupäev]\n\nLepingupooled:\n\nCrossFit Tartu\n\nOmanik: Ain Lubi\nAsukoht: Tartu, Aardla\nedaspidi „Teenusepakkuja” või „Affiliate“\n[Kliendi nimi ja isikukood]\n\n[Kontaktandmed: aadress, telefon, e-post]\nedaspidi „Klient”\n1. Lepingu ese\n1.1 Käesoleva lepingu esemeks on CrossFit Tartu poolt pakutavate treeningvõimaluste, sh rühmatreeningute, iseseisva treeningu ja muude seotud teenuste kasutamise õigus.\n1.2 Leping on tähtajatu ning Klient võib tasu eest kasutada Teenusepakkuja treeningteenuseid käesolevas lepingus sätestatud tingimustel.\n\n2. Liikmemaks ja maksetingimused\n2.1 Klient kohustub tasuma igakuist liikmemaksu summas [X eurot].\n2.2 Liikmemaks kuulub tasumisele hiljemalt iga kuu 15. kuupäevaks.\n2.3 Maksetingimused (sh arveldusarve number, selgitus jms) määratakse Teenusepakkuja poolt. Klient vastutab õigeaegse ning õige viitenumbriga tasumise eest.\n2.4 Viivitusintressi või leppetrahvi võidakse rakendada vastavalt Teenusepakkuja kehtestatud üldtingimustele, kui Klient ei ole kokkulepitud tähtpäevaks liikmemaksu tasunud. Teenusepakkuja võib samuti peatada Kliendi treeninguõiguse, kuni võlgnevus on tasutud.\n\n3. Teenuste kasutamine\n3.1 Klient on kohustatud tutvuma CrossFit Tartu sisekorraeeskirjadega (sh turvalisus, hügieen, treeningute registreerimine, tühistamise kord jms) ja neid täitma.\n3.2 Teenusepakkujal on õigus ajutiselt piirata treeningute või ruumide kasutamist seoses remondi, hooldustööde või muude etteplaneeritud tegevustega, teavitades sellest mõistliku aja jooksul ette.\n3.3 Teenusepakkuja võib teha muudatusi treeningute ajakavas, hinnakirjas või sisukorras, teavitades sellest Kliendi e-posti või veebilehe vahendusel. Oluliste muudatuste puhul on Kliendil õigus leping üles öelda, teatades sellest 14 päeva ette.\n\n4. Lepingu kestus ja lõpetamine\n4.1 Leping jõustub selle allkirjastamisest (või digiallkirjast) ning on sõlmitud tähtajatult.\n4.2 Klient võib lepingu igal ajal üles öelda, esitades Teenusepakkujale kirjaliku (või digitaalse) avalduse. Lepingu lõppemisest tulenevalt arvestatakse liikmemaks proportsionaalselt selle kuu kasutusajaga või vastavalt Teenusepakkuja üldtingimustele.\n4.3 Teenusepakkuja võib lepingu erakorraliselt lõpetada, kui Klient on oluliselt lepingut rikkunud (näiteks korduv makseviivitus või sisekorraeeskirjade rikkumine).\n\n5. Vastutus ja pretensioonid\n5.1 Teenusepakkuja vastutab Kliendi ees üksnes siis, kui kahju või kahjustus on põhjustatud Teenusepakkuja raskest hooletusest või tahtlikust tegevusest.\n5.2 Klient vastutab oma tervisliku seisundi eest ning on kohustatud veenduma, et tal pole vastunäidustusi treeningutes osalemiseks.\n5.3 Kui Kliendil on kaebusi või pretensioone, lahendatakse need esmalt heas usus läbirääkimiste teel. Vaidluste jätkumisel on Kliendil õigus pöörduda Tarbijakaitse ja Tehnilise Järelevalve Ameti või kohtusse vastavalt Eesti Vabariigi seadustele.\n\n6. Isikuandmete kaitse ja GDPR\n6.1 Teenusepakkuja töötleb Kliendi isikuandmeid (nt nimi, kontaktandmed, makseinfo) üksnes teenuste osutamiseks, lepingu täitmiseks, raamatupidamis- või juriidiliste kohustuste täitmiseks vastavalt Euroopa Liidu isikuandmete kaitse üldmäärusele (GDPR) ja Eesti seadustele.\n6.2 Klient võib igal ajal küsida teavet enda isikuandmete töötlemise kohta ning taotleda parandamist, kustutamist või töötlemise piiramist, kui see ei ole vastuolus seadusest tulenevate kohustustega.\n\n7. Muud tingimused\n7.1 Poolte vahelised teated loetakse kehtivaks, kui need on edastatud e-posti teel, kirjalikult või muus tõendatavas vormis.\n7.2 Kõik lepingus puuduvad küsimused ja suhted lahendatakse vastavalt Eesti Vabariigi kehtivatele õigusaktidele.\n7.3 Kokkuleppe muutmine või täiendamine toimub kirjalikult või digiallkirjastatud lisakokkuleppega.\n\n8. Allkirjastamine ja jõustumine\n8.1 Klient kinnitab, et on käesoleva lepingu ja teenusepakkuja Terms and Conditions (üldtingimuste) sisust aru saanud ning nõustub nendega.\n8.2 Leping loetakse sõlmituks ning õiguslikult siduvaks hetkest, mil Klient on lepingu allkirjastanud (sh digiallkirjastanud) või klõpsanud „Accept” (nõustun) nuppu.\n\nPOOLTE ALLEKIRJAD\n\nCrossFit Tartu\n(omanik Ain Lubi)\nAllkiri: …………………….. Kuupäev: ………………\n\nKlient\n[nimi ja isikukood]\nAllkiri: …………………….. Kuupäev: ………………		85	month	28	2028-10-11 00:00:00	t	accepted	2025-03-22 17:26:02.484	2025-03-22 17:38:52.273
\.


--
-- Data for Name: ContractLogs; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."ContractLogs" (id, "contractId", "userId", "affiliateId", action, "createdAt") FROM stdin;
1	1	3	2	User accepted the contract	2025-03-22 17:36:07.476
2	1	3	2	User accepted the contract	2025-03-22 17:38:52.29
3	2	4	1	User accepted the contract	2025-03-22 18:36:17.179
4	1	3	2	change end date	2025-03-22 18:39:25.638
\.


--
-- Data for Name: ContractTemplate; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."ContractTemplate" (id, "affiliateId", content, "createdAt") FROM stdin;
91ecd70b-ccd0-4110-842f-2566d9c0ff73	1	Leping nr [X]\nSõlmitud: [kuupäev]\n\nLepingupooled:\n\nCrossFit Viljandi\n\nOmanik: Mihekl\nAsukoht: \nedaspidi „Teenusepakkuja” või „Affiliate“\n[Kliendi nimi ja isikukood]\n\n[Kontaktandmed: aadress, telefon, e-post]\nedaspidi „Klient”\n1. Lepingu ese\n1.1 Käesoleva lepingu esemeks on CrossFit Tartu poolt pakutavate treeningvõimaluste, sh rühmatreeningute, iseseisva treeningu ja muude seotud teenuste kasutamise õigus.\n1.2 Leping on tähtajatu ning Klient võib tasu eest kasutada Teenusepakkuja treeningteenuseid käesolevas lepingus sätestatud tingimustel.\n\n2. Liikmemaks ja maksetingimused\n2.1 Klient kohustub tasuma igakuist liikmemaksu summas [X eurot].\n2.2 Liikmemaks kuulub tasumisele hiljemalt iga kuu 15. kuupäevaks.\n2.3 Maksetingimused (sh arveldusarve number, selgitus jms) määratakse Teenusepakkuja poolt. Klient vastutab õigeaegse ning õige viitenumbriga tasumise eest.\n2.4 Viivitusintressi või leppetrahvi võidakse rakendada vastavalt Teenusepakkuja kehtestatud üldtingimustele, kui Klient ei ole kokkulepitud tähtpäevaks liikmemaksu tasunud. Teenusepakkuja võib samuti peatada Kliendi treeninguõiguse, kuni võlgnevus on tasutud.\n\n3. Teenuste kasutamine\n3.1 Klient on kohustatud tutvuma CrossFit Tartu sisekorraeeskirjadega (sh turvalisus, hügieen, treeningute registreerimine, tühistamise kord jms) ja neid täitma.\n3.2 Teenusepakkujal on õigus ajutiselt piirata treeningute või ruumide kasutamist seoses remondi, hooldustööde või muude etteplaneeritud tegevustega, teavitades sellest mõistliku aja jooksul ette.\n3.3 Teenusepakkuja võib teha muudatusi treeningute ajakavas, hinnakirjas või sisukorras, teavitades sellest Kliendi e-posti või veebilehe vahendusel. Oluliste muudatuste puhul on Kliendil õigus leping üles öelda, teatades sellest 14 päeva ette.\n\n4. Lepingu kestus ja lõpetamine\n4.1 Leping jõustub selle allkirjastamisest (või digiallkirjast) ning on sõlmitud tähtajatult.\n4.2 Klient võib lepingu igal ajal üles öelda, esitades Teenusepakkujale kirjaliku (või digitaalse) avalduse. Lepingu lõppemisest tulenevalt arvestatakse liikmemaks proportsionaalselt selle kuu kasutusajaga või vastavalt Teenusepakkuja üldtingimustele.\n4.3 Teenusepakkuja võib lepingu erakorraliselt lõpetada, kui Klient on oluliselt lepingut rikkunud (näiteks korduv makseviivitus või sisekorraeeskirjade rikkumine).\n\n5. Vastutus ja pretensioonid\n5.1 Teenusepakkuja vastutab Kliendi ees üksnes siis, kui kahju või kahjustus on põhjustatud Teenusepakkuja raskest hooletusest või tahtlikust tegevusest.\n5.2 Klient vastutab oma tervisliku seisundi eest ning on kohustatud veenduma, et tal pole vastunäidustusi treeningutes osalemiseks.\n5.3 Kui Kliendil on kaebusi või pretensioone, lahendatakse need esmalt heas usus läbirääkimiste teel. Vaidluste jätkumisel on Kliendil õigus pöörduda Tarbijakaitse ja Tehnilise Järelevalve Ameti või kohtusse vastavalt Eesti Vabariigi seadustele.\n\n6. Isikuandmete kaitse ja GDPR\n6.1 Teenusepakkuja töötleb Kliendi isikuandmeid (nt nimi, kontaktandmed, makseinfo) üksnes teenuste osutamiseks, lepingu täitmiseks, raamatupidamis- või juriidiliste kohustuste täitmiseks vastavalt Euroopa Liidu isikuandmete kaitse üldmäärusele (GDPR) ja Eesti seadustele.\n6.2 Klient võib igal ajal küsida teavet enda isikuandmete töötlemise kohta ning taotleda parandamist, kustutamist või töötlemise piiramist, kui see ei ole vastuolus seadusest tulenevate kohustustega.\n\n7. Muud tingimused\n7.1 Poolte vahelised teated loetakse kehtivaks, kui need on edastatud e-posti teel, kirjalikult või muus tõendatavas vormis.\n7.2 Kõik lepingus puuduvad küsimused ja suhted lahendatakse vastavalt Eesti Vabariigi kehtivatele õigusaktidele.\n7.3 Kokkuleppe muutmine või täiendamine toimub kirjalikult või digiallkirjastatud lisakokkuleppega.\n\n8. Allkirjastamine ja jõustumine\n8.1 Klient kinnitab, et on käesoleva lepingu ja teenusepakkuja Terms and Conditions (üldtingimuste) sisust aru saanud ning nõustub nendega.\n8.2 Leping loetakse sõlmituks ning õiguslikult siduvaks hetkest, mil Klient on lepingu allkirjastanud (sh digiallkirjastanud) või klõpsanud „Accept” (nõustun) nuppu.\n\nPOOLTE ALLEKIRJAD\n\nCrossFit\n(omanik i)\nAllkiri: …………………….. Kuupäev: ………………\n\nKlient\n[nimi ja isikukood]\nAllkiri: …………………….. Kuupäev: ………………	2025-03-22 17:02:48.084
9543480a-ece0-4fd2-afcd-c9239e1585f2	2	Leping nr [X]\nSõlmitud: [kuupäev]\n\nLepingupooled:\n\nCrossFit Tartu\n\nOmanik: Ain Lubi\nAsukoht: Tartu, Aardla\nedaspidi „Teenusepakkuja” või „Affiliate“\n[Kliendi nimi ja isikukood]\n\n[Kontaktandmed: aadress, telefon, e-post]\nedaspidi „Klient”\n1. Lepingu ese\n1.1 Käesoleva lepingu esemeks on CrossFit Tartu poolt pakutavate treeningvõimaluste, sh rühmatreeningute, iseseisva treeningu ja muude seotud teenuste kasutamise õigus.\n1.2 Leping on tähtajatu ning Klient võib tasu eest kasutada Teenusepakkuja treeningteenuseid käesolevas lepingus sätestatud tingimustel.\n\n2. Liikmemaks ja maksetingimused\n2.1 Klient kohustub tasuma igakuist liikmemaksu summas [X eurot].\n2.2 Liikmemaks kuulub tasumisele hiljemalt iga kuu 15. kuupäevaks.\n2.3 Maksetingimused (sh arveldusarve number, selgitus jms) määratakse Teenusepakkuja poolt. Klient vastutab õigeaegse ning õige viitenumbriga tasumise eest.\n2.4 Viivitusintressi või leppetrahvi võidakse rakendada vastavalt Teenusepakkuja kehtestatud üldtingimustele, kui Klient ei ole kokkulepitud tähtpäevaks liikmemaksu tasunud. Teenusepakkuja võib samuti peatada Kliendi treeninguõiguse, kuni võlgnevus on tasutud.\n\n3. Teenuste kasutamine\n3.1 Klient on kohustatud tutvuma CrossFit Tartu sisekorraeeskirjadega (sh turvalisus, hügieen, treeningute registreerimine, tühistamise kord jms) ja neid täitma.\n3.2 Teenusepakkujal on õigus ajutiselt piirata treeningute või ruumide kasutamist seoses remondi, hooldustööde või muude etteplaneeritud tegevustega, teavitades sellest mõistliku aja jooksul ette.\n3.3 Teenusepakkuja võib teha muudatusi treeningute ajakavas, hinnakirjas või sisukorras, teavitades sellest Kliendi e-posti või veebilehe vahendusel. Oluliste muudatuste puhul on Kliendil õigus leping üles öelda, teatades sellest 14 päeva ette.\n\n4. Lepingu kestus ja lõpetamine\n4.1 Leping jõustub selle allkirjastamisest (või digiallkirjast) ning on sõlmitud tähtajatult.\n4.2 Klient võib lepingu igal ajal üles öelda, esitades Teenusepakkujale kirjaliku (või digitaalse) avalduse. Lepingu lõppemisest tulenevalt arvestatakse liikmemaks proportsionaalselt selle kuu kasutusajaga või vastavalt Teenusepakkuja üldtingimustele.\n4.3 Teenusepakkuja võib lepingu erakorraliselt lõpetada, kui Klient on oluliselt lepingut rikkunud (näiteks korduv makseviivitus või sisekorraeeskirjade rikkumine).\n\n5. Vastutus ja pretensioonid\n5.1 Teenusepakkuja vastutab Kliendi ees üksnes siis, kui kahju või kahjustus on põhjustatud Teenusepakkuja raskest hooletusest või tahtlikust tegevusest.\n5.2 Klient vastutab oma tervisliku seisundi eest ning on kohustatud veenduma, et tal pole vastunäidustusi treeningutes osalemiseks.\n5.3 Kui Kliendil on kaebusi või pretensioone, lahendatakse need esmalt heas usus läbirääkimiste teel. Vaidluste jätkumisel on Kliendil õigus pöörduda Tarbijakaitse ja Tehnilise Järelevalve Ameti või kohtusse vastavalt Eesti Vabariigi seadustele.\n\n6. Isikuandmete kaitse ja GDPR\n6.1 Teenusepakkuja töötleb Kliendi isikuandmeid (nt nimi, kontaktandmed, makseinfo) üksnes teenuste osutamiseks, lepingu täitmiseks, raamatupidamis- või juriidiliste kohustuste täitmiseks vastavalt Euroopa Liidu isikuandmete kaitse üldmäärusele (GDPR) ja Eesti seadustele.\n6.2 Klient võib igal ajal küsida teavet enda isikuandmete töötlemise kohta ning taotleda parandamist, kustutamist või töötlemise piiramist, kui see ei ole vastuolus seadusest tulenevate kohustustega.\n\n7. Muud tingimused\n7.1 Poolte vahelised teated loetakse kehtivaks, kui need on edastatud e-posti teel, kirjalikult või muus tõendatavas vormis.\n7.2 Kõik lepingus puuduvad küsimused ja suhted lahendatakse vastavalt Eesti Vabariigi kehtivatele õigusaktidele.\n7.3 Kokkuleppe muutmine või täiendamine toimub kirjalikult või digiallkirjastatud lisakokkuleppega.\n\n8. Allkirjastamine ja jõustumine\n8.1 Klient kinnitab, et on käesoleva lepingu ja teenusepakkuja Terms and Conditions (üldtingimuste) sisust aru saanud ning nõustub nendega.\n8.2 Leping loetakse sõlmituks ning õiguslikult siduvaks hetkest, mil Klient on lepingu allkirjastanud (sh digiallkirjastanud) või klõpsanud „Accept” (nõustun) nuppu.\n\nPOOLTE ALLEKIRJAD\n\nCrossFit Tartu\n(omanik Ain Lubi)\nAllkiri: …………………….. Kuupäev: ………………\n\nKlient\n[nimi ja isikukood]\nAllkiri: …………………….. Kuupäev: ………………	2025-03-22 17:18:17.992
\.


--
-- Data for Name: ContractTerms; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."ContractTerms" (id, type, terms, "createdAt") FROM stdin;
1	contract	Terms and Conditions\nLast updated: [Date]\n\n1. Introduction\n1.1 These Terms and Conditions (“T&C”) govern your use of and/or subscription to the membership services (“Services”) provided by [Provider] (“we,” “us,” “our”).\n1.2 By clicking on the “Accept” button (or a similarly labeled checkbox) and/or by signing this contract electronically, you acknowledge that you have read, understood, and agree to be legally bound by these T&C.\n\n2. Parties to the Agreement\n2.1 The parties to this Agreement are:\n\n[Provider Name, if needed at runtime], hereinafter referred to as the “Provider,” and\nYou, hereinafter referred to as the “Member” or “you.”\n2.2 These T&C also apply to any amendments, supplemental policies, or additional documents that are referenced or linked within these T&C.\n\n3. Scope of Services\n3.1 The Provider offers gym or fitness-related membership services, including but not limited to access to facilities, group classes, personal training sessions, and other related offerings (“Services”).\n3.2 All Services are subject to availability and may be modified, updated, or discontinued at any time at the Provider’s discretion, provided reasonable notice is given for significant changes.\n\n4. Membership and Payment\n4.1 Membership: Your membership entitles you to the benefits specified in the membership plan you select.\n4.2 Fees: You agree to pay the membership fees according to the plan you have chosen. All fees are due in advance and must be paid on the due date indicated in the payment schedule.\n4.3 Payment Methods: Acceptable forms of payment include [list methods, e.g., credit card, direct debit, etc.]. You agree to keep your payment information accurate and updated.\n4.4 Late Payment: Late or missed payments may result in suspension or termination of membership, and you may be charged a late fee or any applicable administrative fee.\n4.5 Refunds: Unless otherwise stated by applicable consumer protection laws, membership fees are generally non-refundable. Any exceptions will be handled in compliance with applicable EU consumer protection regulations and relevant national laws.\n\n5. Data Protection (GDPR)\n5.1 Data Controller: The Provider acts as the Data Controller for personal data you provide.\n5.2 Purpose of Data Processing: Personal data (e.g., name, contact details, payment information, and fitness activity) is processed for the following purposes:\n\nMembership administration and invoicing\nProviding access to facilities and Services\nCommunicating with you regarding updates or changes to your membership\nComplying with legal obligations (e.g., accounting, safety, or public health requirements)\n5.3 Legal Basis: The legal bases for processing your personal data include your consent (when required), performance of a contract, and compliance with legal obligations.\n5.4 Data Sharing: Your personal data may be shared with third parties only to the extent necessary for payment processing, IT support, or other legitimate business needs. All third parties must adhere to data protection requirements in line with the EU General Data Protection Regulation (“GDPR”).\n5.5 Data Retention: Personal data is retained as long as necessary to fulfill the purposes outlined in these T&C, unless a different retention period is required by law.\n5.6 Your Rights: Under the GDPR, you have the right to access, correct, delete, restrict, or object to the processing of your personal data, as well as the right to data portability. You may also lodge a complaint with a supervisory authority if you believe your rights have been infringed.\n5.7 Contact for Privacy Matters: If you have questions about data processing or wish to exercise your rights, please contact [provider’s email/phone/address, or generic contact point].\n6. User Conduct\n6.1 You agree to use the facilities and Services responsibly and to respect other members and staff.\n6.2 You will abide by any facility rules, safety instructions, and applicable policies that the Provider implements.\n\n7. Warranties and Limitation of Liability\n7.1 Warranties: The Provider makes reasonable efforts to ensure Services are provided with due care and skill but does not guarantee uninterrupted or error-free operation.\n7.2 Liability: To the maximum extent permitted by applicable law, the Provider shall not be liable for any indirect, incidental, special, or consequential damages, including but not limited to loss of profits, data, or goodwill. The Provider is not liable for personal injury or property damage sustained while using facilities, except where caused by the Provider’s gross negligence or willful misconduct.\n7.3 Consumer Rights: Nothing in these T&C limits your statutory rights under EU or local consumer protection laws.\n\n8. Termination\n8.1 Termination by You: You may terminate your membership by providing notice per the cancellation policy stated in your membership plan or required by law.\n8.2 Termination by the Provider: The Provider may terminate or suspend your membership if you breach these T&C, fail to pay fees, or otherwise violate any applicable law or policies.\n8.3 Effects of Termination: Upon termination, your access to Services ends. Any outstanding fees become immediately due, unless otherwise specified by law or agreement.\n\n9. Governing Law and Dispute Resolution\n9.1 These T&C are governed by and construed in accordance with applicable local laws and EU regulations.\n9.2 Any disputes arising from or in connection with these T&C shall be subject to the jurisdiction of the competent courts in [jurisdiction] (or as otherwise mandated by consumer protection rules).\n\n10. Changes to These Terms\n10.1 The Provider reserves the right to modify these T&C from time to time. In the event of significant changes, reasonable notice will be provided (e.g., via email or a website announcement).\n10.2 Continued use of Services after such changes signifies your acceptance of the updated T&C.\n\n11. Binding Acceptance\n11.1 By checking the “I Accept the Terms and Conditions” box (or an equivalent statement) and clicking the “Accept” button, you confirm that you have read, understood, and agree to abide by these T&C.\n11.2 You acknowledge that clicking the “Accept” button creates a legally binding agreement between you and the Provider, having the same legal effect as a written and signed contract.\n\n12. Contact Information\nFor any questions or concerns about these T&C, please contact [generic provider contact details or instructions].	2025-03-22 17:37:36.1
2	register	Terms and Conditions for Irontrack\nLast Updated: 25.02.2025\n\n1. Introduction\nThese Terms and Conditions ("Terms") govern your use of [Your App Name] (the "App"), operated by [Your Company Name] ("we," "us," or "our"). By accessing or using the App, you agree to comply with these Terms. The App is designed for fitness clubs and users in Estonia, Latvia, and Lithuania (the "Baltic Region").\n\n2. Acceptance of Terms\nBy creating an account, purchasing packages, or using any services through the App, you:\n\nConfirm you are at least 18 years old or have legal guardian consent.\n\nAgree to be legally bound by these Terms.\n\nAcknowledge sole responsibility for risks associated with fitness activities booked via the App.\n\n3. User Responsibilities\n3.1 General Obligations\nProvide accurate and current information during registration.\n\nMaintain the confidentiality of your account credentials.\n\nNotify us immediately of unauthorized account use.\n\n3.2 Fitness Activities\nAssumption of Risk: You acknowledge that participating in workouts, classes, or events booked through the App carries inherent risks (e.g., injury, illness, or death). You voluntarily assume all risks.\n\nHealth Disclaimer: Confirm you are in good physical health and have consulted a medical professional before engaging in strenuous activities.\n\nRelease of Liability: Neither [Your Company Name] nor affiliated fitness clubs are liable for injuries, damages, or losses arising from your participation in workouts.\n\n4. Fitness Club Responsibilities\nClubs using the App to manage memberships, sell packages, or host workouts agree to:\n\nProvide accurate descriptions of workouts, including intensity levels and requirements.\n\nComply with all local laws and safety standards in the Baltic Region.\n\nMaintain appropriate insurance coverage for their activities.\n\n5. Payments & Refunds\nAll purchases (e.g., workout packages, subscriptions) are final unless otherwise stated.\n\nRefunds may be granted at the sole discretion of the fitness club or [Your Company Name].\n\nSubscriptions auto-renew unless canceled before the billing cycle.\n\n6. Intellectual Property\nThe App, its content, logos, and features are owned by [Your Company Name] and protected under EU and Baltic copyright laws.\n\nYou may not copy, modify, or distribute App content without written permission.\n\n7. Data Privacy\nWe comply with the EU General Data Protection Regulation (GDPR).\n\nPersonal data (e.g., name, email, payment details) is collected to provide services and improve the App.\n\nUsers may request data deletion or corrections via [contact email].\n\n8. Termination\nWe reserve the right to suspend or terminate your access to the App for:\n\nViolations of these Terms.\n\nFraudulent or harmful behavior.\n\nNon-payment of fees.\n\n9. Governing Law\nThese Terms are governed by the laws of [Your Company’s Registered Country, e.g., Estonia]. Disputes will be resolved in the courts of [Jurisdiction City].\n\n10. Changes to Terms\nWe may update these Terms periodically. Continued use of the App after changes constitutes acceptance.\n\n11. Contact\nFor questions about these Terms, contact:\n[Your Company Name]\n[Email Address]\n[Physical Address in the Baltic Region]\n\nBy clicking "I Accept," you confirm that you have read, understood, and agree to these Terms and assume full responsibility for your actions.	2025-03-22 17:37:48.86
\.


--
-- Data for Name: Credit; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."Credit" (id, "userId", credit, "affiliateId") FROM stdin;
1	3	1500	2
\.


--
-- Data for Name: Exercise; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."Exercise" (id, "exerciseData", "trainingId") FROM stdin;
1	squat 5x5	1
2	30 Snatches (61/43 kg)	2
\.


--
-- Data for Name: Members; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."Members" (id, "affiliateId", "userId", "visitCount", "addScoreCount", "atRisk", "ristData", "isActive") FROM stdin;
1	1	4	0	0	f	\N	t
2	2	3	0	0	f	\N	t
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."Message" (id, "affiliateId", "recipientId", subject, "recipientType", body, "createdAt") FROM stdin;
1	2	6	tere	user	<p>tere</p>	2025-03-22 18:40:27.739
\.


--
-- Data for Name: MessageGroup; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."MessageGroup" (id, "groupName", "affiliateId", "createdAt") FROM stdin;
1	Members	2	2025-03-22 18:41:32.809
\.


--
-- Data for Name: PaymentHoliday; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."PaymentHoliday" (id, "contractId", "userId", "affiliateId", month, reason, "monthlyFee", accepted, "createdAt") FROM stdin;
\.


--
-- Data for Name: Plan; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."Plan" (id, name, "validityDays", price, "additionalData", sessions, "affiliateId", active, "ownerId") FROM stdin;
1	10 sessions	60	80		10	1	t	1
2	1 time pass	30	10		1	1	t	1
3	Unlimited Month	31	75		9999	1	t	1
4	10 sessions	60	100		10	2	t	2
5	Unlimited Monthly pass	31	90		9999	2	t	2
6	1 time pass	31	15		1	2	t	2
\.


--
-- Data for Name: Record; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."Record" (id, type, name, date, score, weight, "time", "userId") FROM stdin;
1	WOD	AMANDA	2025-03-21 00:00:00	223	\N	\N	3
2	WOD	ISABEL	2025-03-21 00:00:00	03:20	\N	\N	3
\.


--
-- Data for Name: SectorComment; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."SectorComment" (id, content, "trainingDayId", "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: SectorYoutubeLink; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."SectorYoutubeLink" (id, url, "trainingSectorId") FROM stdin;
3	https://youtu.be/GhxhiehJcQY?si=eYXTx8mPFaEdDoay	1
\.


--
-- Data for Name: SignedContract; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."SignedContract" (id, "contractId", "userId", "affiliateId", "acceptType", "contractTermsId", "signedAt") FROM stdin;
2	1	3	2	checkout	1	2025-03-22 17:38:52.295
3	2	4	1	checkout	1	2025-03-22 18:36:17.185
\.


--
-- Data for Name: Training; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."Training" (id, type, "wodName", "wodType", date, score, "userId") FROM stdin;
1	Weightlifting	\N	\N	2025-03-21 00:00:00	\N	3
2	WOD	ISABEL	For Time	2025-03-21 00:00:00	03:20	3
\.


--
-- Data for Name: TrainingDay; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."TrainingDay" (id, name, "trainingPlanId") FROM stdin;
1	Day 1	1
\.


--
-- Data for Name: TrainingPlan; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."TrainingPlan" (id, name, "creatorId", "userId", "createdAt") FROM stdin;
1	Bulking	5	3	2025-03-22 18:46:24.359
\.


--
-- Data for Name: TrainingSector; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."TrainingSector" (id, type, content, completed, "trainingDayId") FROM stdin;
1	Strength	Snatch 5x6	f	1
2	WOD	EMOM 12:\nMin. 1 | 2 rope climbs (4.6/4.6 m)\nMin. 2 | :30 bike, row, ski\n\nPost-workout benchmark\nFor calories:\n1:00 bike	f	1
3	Essentials	Run 5k	f	1
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."User" (id, email, password, "fullName", "emailConfirmed", "verificationToken", "verificationExpires", "resetToken", "resetTokenExpires", "affiliateOwner", "pricingPlan", "createdAt", "monthlyGoal", "isAcceptedTerms", phone, address, logo, "emergencyContact", "homeAffiliate") FROM stdin;
1	a@a.a	$2b$10$NibH7LZlqLcW7VdRZ5DFOetGNqxc2yy6p/L50xJPxPBSlUBxNC0Zi	Mihkel K	t	3930e07bfc6e0d03d075f35820b5cdea3d8b797b99d3681c581f2005253c9b30	2025-03-23 16:55:21.947	\N	\N	t	premium	2025-03-22 16:55:21.949	\N	t	565656565		\N	\N	\N
2	d@d.d	$2b$10$jBtNJ1u.Z4IkK9KwIOC.N.xTAjtk/YebfJqMfyqzD9ssbJnPSVNJC	Ain Lubi	t	dcf7de9f9fd714835730aeb529979909caf0f0074701019379aadbee19131e87	2025-03-23 16:56:03.827	\N	\N	t	premium	2025-03-22 16:56:03.828	\N	t	5565656565		\N	\N	\N
6	prii.sander@gmail.com	$2b$10$pBsp2OzZA9Yt.yxyutgfeOAFYFKQM1t2MMHiP1wV2kF2HTo7fWccu	Sander Prii	t	\N	\N	\N	\N	f	premium	2025-03-22 17:27:21.659	\N	t	+37259928647	lehe 10-1, räni, kambja vald, tartumaa	data:image/jpeg;base64,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	\N	\N
3	c@c.c	$2b$10$FQ7CRBBSdjHG9DEqApda8eLJn9fNf.G6kABykhfA24Rkzjrv4B5Dq	Mati Testija	t	7b657495feea6b6eb217e58f2ebc56364bb22e7623a8820cd5b63a6fb866adf7	2025-03-23 16:56:47.224	\N	\N	f	premium	2025-03-22 16:56:47.225	\N	t	56565656		data:image/jpeg;base64,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	\N	2
4	v@v.v	$2b$10$NEGVhAa6zMddmXmLr2PWleNwVRaDipy73qSPFIbrHWH8SJCzoR3Fq	Kati testija	t	9eca4dbab06501a7e56d365f19f0c4616e49bf82605e2924ffd8be76411ea167	2025-03-23 16:57:23.332	\N	\N	f	premium	2025-03-22 16:57:23.333	\N	t	565656565		data:image/jpeg;base64,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	\N	1
5	t@t.t	$2b$10$61kshHFcU71.HHCbYF67g.EPeZWn4BnbmKIwEVGmmNeLc89tK5a0S	muumitroll	t	e4a3d51747285e0f067c7a3e62dc405bf32abe0fd1c9a225bc8472bfd36848ac	2025-03-23 16:58:12.359	\N	\N	f	premium	2025-03-22 16:58:12.36	\N	t	565656565		data:image/jpeg;base64,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	\N	\N
\.


--
-- Data for Name: UserMessageGroup; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."UserMessageGroup" (id, "userId", "groupId") FROM stdin;
1	6	1
\.


--
-- Data for Name: UserNote; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."UserNote" (id, "userId", note, flag, "createdAt") FROM stdin;
\.


--
-- Data for Name: UserPlan; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."UserPlan" (id, "userId", "contractId", "affiliateId", "planId", "planName", "validityDays", price, "purchasedAt", "endDate", "sessionsLeft") FROM stdin;
1	3	1	2	0	Monthly Membership	31	85	2025-03-22 17:38:52.299	2025-04-22 16:38:52.299	9998
2	4	2	1	0	Monthly Membership	31	75	2025-03-22 18:36:17.189	2025-04-22 17:36:17.189	9999
3	4	\N	1	2	1 time pass	30	10	2025-03-22 18:37:04.427	2025-04-21 18:37:04.427	1
4	3	\N	2	6	1 time pass	31	15	2025-03-22 18:39:08.799	2025-04-22 17:39:08.798	1
\.


--
-- Data for Name: Waitlist; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."Waitlist" (id, "classId", "userId", "userPlanId", "createdAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
bd49b2c0-6e7c-480d-be90-384c79f7e500	94724c14c0bc4fa6d4c3977bfc27ef6a59cda3e9baac8792083148a2add380d7	2025-03-22 17:38:02.929342+02	20250322153802_initial	\N	\N	2025-03-22 17:38:02.205017+02	1
\.


--
-- Data for Name: defaultWOD; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."defaultWOD" (id, name, type, description) FROM stdin;
198	AMANDA	For Time	9-7-5 reps: Muscle-up, Squat Snatch (61/43 kg)
199	ANGIE	For Time	100 Pull-ups, 100 Push-ups, 100 Sit-ups, 100 Air Squats
200	ANNIE	For Time	50-40-30-20-10 reps: Double-Unders, Sit-ups
201	BARBARA	For Time	5 rounds: 20 Pull-ups, 30 Push-ups, 40 Sit-ups, 50 Air Squats; Rest 3 minutes between rounds
202	CHELSEA	EMOM	Every minute on the minute for 30 minutes: 5 Pull-ups, 10 Push-ups, 15 Air Squats
203	CINDY	AMRAP	20 minutes: 5 Pull-ups, 10 Push-ups, 15 Air Squats
204	DIANE	For Time	21-15-9 reps: Deadlifts (102/70 kg), Handstand Push-ups
205	ELIZABETH	For Time	21-15-9 reps: Squat Cleans (61/43 kg), Ring Dips
207	FRAN	For Time	21-15-9 reps: Thrusters (43/30 kg), Pull-ups
208	GRACE	For Time	30 Clean and Jerks (61/43 kg) for time
210	ISABEL	For Time	30 Snatches (61/43 kg) for time
211	JACKIE	For Time	1000m Row, 50 Thrusters (20/15 kg), 30 Pull-ups
214	LINDA	For Time	10-9-8-7-6-5-4-3-2-1 reps: Deadlift (1.5x bodyweight), Bench Press (bodyweight), Clean (0.75x bodyweight)
217	NANCY	For Time	5 rounds for time: 400m Run, 15 Overhead Squats (43/30 kg)
218	NICOLE	AMRAP	20 minutes: 400m Run, Max Pull-ups. After each run, perform as many Pull-ups as possible until you break, then return to running.
219	ABBATE	For Time	Run 1.6 km, 21 Clean and Jerks (70 kg), Run 800 m, 21 Clean and Jerks (70 kg), Run 1.6 km
220	ADAMBROWN	For Time	2 Rounds: 24 Deadlifts (134 kg), 24 Box Jumps (61 cm), 24 Wall Ball Shots (9 kg), 24 Bench Presses (88 kg), 24 Box Jumps (61 cm), 24 Wall Ball Shots (9 kg), 24 Cleans (66 kg)
221	ADRIAN	For Time	7 Rounds: 3 Forward Rolls, 5 Wall Climbs, 7 Toes-to-Bar, 9 Box Jumps (76 cm)
222	ARNIE	For Time	With a single 32 kg kettlebell: 21 Turkish Get-Ups (Right Arm), 50 Swings, 21 Overhead Squats (Left Arm), 50 Swings, 21 Overhead Squats (Right Arm), 50 Swings, 21 Turkish Get-Ups (Left Arm)
223	BADGER	For Time	3 Rounds: 30 Squat Cleans (43 kg), 30 Pull-Ups, Run 800 m
224	BARAZZA	AMRAP	18 Minutes: Run 200 m, 9 Deadlifts (125 kg), 6 Burpee Bar Muscle-Ups
225	BELL	For Time	3 Rounds: 21 Deadlifts (84 kg), 15 Pull-Ups, 9 Front Squats (84 kg)
226	BIG SEXY	For Time	5 Rounds: 6 Deadlifts (143 kg), 6 Burpees, 5 Cleans (102 kg), 5 Chest-to-Bar Pull-Ups, 4 Thrusters (70 kg), 4 Muscle-Ups
227	BLAKE	For Time	4 Rounds: 30 m Walking Lunge with 20 kg plate held overhead, 30 Box Jumps (61 cm), 20 Wall Ball Shots (9 kg), 10 Handstand Push-Ups
228	BOWEN	For Time	3 Rounds: Run 800 m, 7 Deadlifts (125 kg), 10 Burpee Pull-Ups, 14 Single-Arm Kettlebell Thrusters (24 kg, 7 each arm), 20 Box Jumps (61 cm)
229	BRADLEY	For Time	10 Rounds: Sprint 100 m, 10 Pull-Ups, Sprint 100 m, 10 Burpees; Rest 30 seconds
230	BRADSHAW	For Time	10 Rounds: 3 Handstand Push-Ups, 6 Deadlifts (102 kg), 12 Pull-Ups, 24 Double-Unders
231	BREHM	For Time	10 Rope Climbs (4.5 m), 20 Back Squats (102 kg), 30 Handstand Push-Ups, Row 40 Calories
232	BRENTON	For Time	5 Rounds: 30 m Bear Crawl, 30 m Standing Broad-Jump; Do 3 Burpees after every 5 Broad-Jumps. If you have a 9 kg vest or body armor, wear it.
233	BULL	For Time	2 Rounds: Run 1.6 km, 50 Pull-Ups, 100 Push-Ups, 150 Squats; Wear a 9 kg vest if you have one.
234	CAL	For Time	Run 800 m with a 9 kg medicine ball, 80 Squats with medicine ball, 60 Sit-Ups with medicine ball, 40 Push-Ups with medicine ball, Run 800 m with medicine ball
235	CARSE	For Time	21-18-15-12-9-6-3 reps: Squat Clean (43 kg), Double-Under, Deadlift (70 kg), Box Jump (61 cm); Begin each round with a 50 m Bear Crawl.
236	CHAD	For Time	1,000 Box Step-Ups (51 cm) with a 20 kg rucksack
237	CHESTER	For Time	1-2-3-4-5-6-7-8-9-10 reps: Clean (61 kg), Strict Handstand Push-Up
238	CHRIS	For Time	5 Rounds: 15 GHD Sit-Ups, 15 Back Extensions, 15 Knees-to-Elbows, 15 Toes-to-Bar
239	CLARK	For Time	3 Rounds: 155 Squats, 10 Meter Hill Sprint (20 m elevation), 10 Rope Climbs (4.5 m)
240	CLIFFORD	For Time	6 Rounds: 3 Deadlifts (143 kg), 3 Rope Climbs (4.5 m), 3 Handstand Push-Ups; If you have a 9 kg vest or body armor, wear it.
241	CLOVIS	For Time	Run 16 km, 150 Burpee Pull-Ups; Partition the run and burpee pull-ups as needed. If you have a 9 kg vest or body armor, wear it.
242	COE	For Time	10 Rounds: 10 Thrusters (43 kg), 10 Ring Push-Ups
243	COLLIN	For Time	6 Rounds: Carry 22.5 kg dumbbells 180 m, 50 Push-Ups, Carry 22.5 kg dumbbells 180 m, 50 Squats; If you have a 9 kg vest or body armor, wear it.
244	COLOMBIA	For Time	5 Rounds: 800 m Run, 200 m Dumbbell Farmers Carry (22.5 kg), 50 Push-Ups
245	COOPER	For Time	10 Rounds: 10 Burpees, 10 Squats, 10 Push-Ups; Rest 2 minutes between rounds.
246	CROCKETT	For Time	10-9-8-7-6-5-4-3-2-1 reps: Squat Clean (70 kg), Double-Under, Deadlift (102 kg), Box Jump (61 cm); Begin each round with a 50 m Bear Crawl.
247	CURTIS P	For Time	100 reps of: 1 Power Clean (43 kg), 1 Lunge (Left Leg), 1 Lunge (Right Leg), 1 Push Press
248	DANNY	AMRAP	20 Minutes: 30 Box Jumps (61 cm), 20 Push Presses (53kg/35kg), 30 pull ups
249	DANIEL	For Time	50 Pull-Ups, 400 meter Run, 21 Thrusters (43 kg), 800 meter Run, 21 Thrusters (43 kg), 400 meter Run, 50 Pull-Ups
250	DEL	For Time	25 Burpees, Run 400 meters with a 20 kg plate, 25 Weighted Pull-Ups with a 20 kg plate, Run 400 meters with a 20 kg plate, 25 Handstand Push-Ups
251	DEMETRI	For Time	21-15-9 reps: Deadlifts (102 kg), Box Jumps (61 cm), Clean-and-Jerks (61 kg)
252	DGB	For Time	8 Rounds: 200 meter Run, 10 meter Rope Climb, 1 Muscle-Up
253	DONNY	For Time	21-15-9-9-15-21 reps: Deadlifts (102 kg), Burpees
254	DORK	For Time	6 Rounds: 60 Double-Unders, 30 Kettlebell Swings (24 kg), 15 Burpees
255	DT	For Time	5 Rounds: 12 Deadlifts (70 kg), 9 Hang Power Cleans (70 kg), 6 Push Jerks (70 kg)
256	DUNN	For Time	3 Rounds: 15 Muscle-Ups, 7 Push Jerks (84 kg), 1000 meter Run
257	EVA	For Time	5 Rounds: 800 meter Run, 30 Kettlebell Swings (32 kg), 30 Pull-Ups
258	FALKEL	For Time	8 Rounds: 200 meter Run, 2 Rope Climbs
259	FELIX	For Time	21-15-9 reps: Deadlifts (102 kg), Box Jumps (61 cm), Clean-and-Jerks (61 kg)
260	FIGHT GONE BAD	EMOM	3 Rounds: 1 minute Wall Balls (9 kg), 1 minute Sumo Deadlift High-Pulls (35 kg), 1 minute Box Jumps (61 cm), 1 minute Push Presses (35 kg), 1 minute Row (calories), 1 minute Rest
324	RANDY	For Time	75 Power Snatches (34 kg)
261	FILTHY 50	For Time	50 Box Jumps (61 cm), 50 Jumping Pull-Ups, 50 Kettlebell Swings (16 kg), 50 Walking Lunges, 50 Knees-to-Elbows, 50 Push Presses (20 kg), 50 Back Extensions, 50 Wall Ball Shots (9 kg), 50 Burpees, 50 Double-Unders
262	FORREST	For Time	3 Rounds: 20 L-Pull-Ups, 30 Toes-to-Bar, 40 Burpees, 800 meter Run
263	FRANTZ	For Time	21-15-9 reps: Thrusters (43 kg), Pull-Ups
264	FRELEN	For Time	5 Rounds: Run 800 meters, 15 Dumbbell Thrusters (22.5 kg), 15 Pull-Ups
265	GALLANT	For Time	For Time: 1 mile Run, 60 Burpee Pull-Ups
266	GARRETT	For Time	3 Rounds: 800 meter Run, 21 L-Pull-Ups
267	GATOR	For Time	8 Rounds: 5 Front Squats (84 kg), 26 Ring Push-Ups
268	GLEN	For Time	30 Clean-and-Jerks (61 kg), 1 mile Run, 10 Rope Climbs, 1 mile Run, 100 Burpees
269	GRIFF	For Time	Run 800 meters, Run 400 meters backwards, Run 800 meters, Run 400 meters backwards
270	GRIFFIN	For Time	800 meter Run, 400 meter Run, 800 meter Run, 400 meter Run
271	HAMMER	For Time	5 Rounds: 5 Power Cleans (61 kg), 10 Front Squats (61 kg), 5 Jerks (61 kg), 20 Pull-Ups
272	HAMMERTIME	For Time	5 Rounds: 5 Deadlifts (102 kg), 10 Toes-to-Bar, 15 Kettlebell Swings (24 kg)
273	HANNAH	For Time	3 Rounds: 800 meter Run, 21 Kettlebell Swings (24 kg), 12 Pull-Ups
274	HANSEN	For Time	5 Rounds: 30 Kettlebell Swings (32 kg), 30 Burpees, 30 GHD Sit-Ups
275	HARD CINDY	AMRAP	20 Minutes: 5 Pull-Ups, 10 Push-Ups, 15 Air Squats
277	HEATHER	For Time	3 Rounds: 200 meter Run, 12 Chest-to-Bar Pull-Ups, 21 Walking Lunges
278	HELEN	For Time	3 Rounds: 400 meter Run, 21 Kettlebell Swings (24 kg), 12 Pull-Ups
279	HILDY	For Time	100 Calorie Row, 75 Thrusters (20 kg), 50 Pull-Ups, 25 Handstand Push-Ups
280	HOLLEYMAN	For Time	30 Rounds: 5 Wall Balls (9 kg), 3 Handstand Push-Ups, 1 Power Clean (84 kg)
281	HOLLYMAN	For Time	30 Rounds: 5 Wall Balls (9 kg), 3 Handstand Push-Ups, 1 Power Clean (84 kg)
282	HORVATH	For Time	2 Rounds: 5 Wall Climbs, 10 Toes-to-Bar, 50 ft. Overhead Walking Lunge (61 kg), 100 ft. Sprint
283	HOTSHOTS 19	For Time	6 Rounds: 30 Air Squats, 19 Power Cleans (61 kg), 7 Strict Pull-Ups, 400 meter Run
284	HULK	For Time	5 Rounds: 5 Power Cleans (102 kg), 5 Front Squats (102 kg), 5 Jerks (102 kg), 3 Muscle-Ups
285	HUMBERTO	For Time	21-15-9 reps: Overhead Squats (43 kg), Bench Presses (bodyweight)
286	JACK	AMRAP	20 Minutes: 10 Push Presses (52 kg), 10 Kettlebell Swings (24 kg), 10 Box Jumps (61 cm)
287	JAMES	For Time	5 Rounds: 200 meter Run, 11 Thrusters (61 kg), 200 meter Run, 11 Pull-Ups
288	JASON	For Time	100 Squats, 5 Muscle-Ups, 75 Squats, 10 Muscle-Ups, 50 Squats, 15 Muscle-Ups, 25 Squats, 20 Muscle-Ups
289	JENNY	AMRAP	20 Minutes: 20 Overhead Squats (43 kg), 20 Back Squats (43 kg), 400 meter Run
290	JERRY	For Time	Run 1 mile, 2,000 meter Row, 1 mile Run
291	JESSE	For Time	3 Rounds: 1 minute Handstand Hold, 100 ft. Walking Lunge, 100 ft. Bear Crawl
292	JESSICA	For Time	800 meter Run, 21 Deadlifts (102 kg), 21 Handstand Push-Ups, 800 meter Run, 15 Deadlifts (102 kg), 15 Handstand Push-Ups, 800 meter Run, 9 Deadlifts (102 kg), 9 Handstand Push-Ups
293	JOSH	For Time	21 Overhead Squats (43 kg), 42 Pull-Ups, 15 Overhead Squats (43 kg), 30 Pull-Ups, 9 Overhead Squats (43 kg), 18 Pull-Ups
294	JOSHIE	For Time	3 Rounds: 21 Kettlebell Swings (24 kg), 21 Pull-Ups, 800 meter Run
295	JT	For Time	21-15-9 reps: Handstand Push-Ups, Ring Dips, Push-Ups
296	JUMBO	For Time	5 Rounds: 30 Wall Balls (9 kg), 30 Box Jumps (61 cm), 30 Kettlebell Swings (24 kg)
297	KALI	For Time	4 Rounds: 100 ft. Walking Lunge, 30 Sit-Ups, 20 Pull-Ups, 10 Handstand Push-Ups
298	KAREN	For Time	150 Wall Balls (9 kg)
299	KELLY	For Time	5 Rounds: 400 meter Run, 30 Box Jumps (61 cm), 30 Wall Balls (9 kg)
300	KLEPTO	For Time	4 Rounds: 27 Box Jumps (61 cm), 20 Burpees, 11 Squat Cleans (61 kg)
301	KYLE	For Time	3 Rounds: 40 Overhead Walking Lunges (20 kg), 30 Box Jumps (61 cm), 20 Wall Balls (9 kg), 10 Handstand Push-Ups
302	LUMBERJACK 20	For Time	20 Deadlifts (125 kg), Run 400 meters, 20 Kettlebell Swings (32 kg), Run 400 meters, 20 Overhead Squats (61 kg), Run 400 meters, 20 Burpees, Run 400 meters, 20 Chest-to-Bar Pull-Ups, Run 400 meters, 20 Box Jumps (61 cm), Run 400 meters, 20 Dumbbell Squat Cleans (22.5 kg), Run 400 meters
303	LUMBERJACK 9	For Time	9 Rounds: 11 Power Cleans (84 kg), 100 meter Sprint, 12 Pull-Ups
304	LYNNE	AMRAP	5 Rounds: Max Reps Bench Press (bodyweight), Max Reps Pull-Ups
305	MAGGIE	For Time	5 Rounds: 20 Handstand Push-Ups, 40 Pull-Ups, 60 Pistols
306	MANION	For Time	7 Rounds: Run 400 meters, 29 Back Squats (61 kg)
307	MANNING	For Time	50-40-30-20-10 reps: Double-Unders, Sit-Ups, Pull-Ups, Push-Ups
308	MARGUERITA	For Time	50 reps: Burpee/Push-Up/Jumping-Jack/Sit-Up/Handstand
309	MARY	AMRAP	20 Minutes: 5 Handstand Push-Ups, 10 Pistols (alternating legs), 15 Pull-Ups
310	MATT 19	For Time	3 Rounds: 400 meter Run, 19 Deadlifts (102 kg), 19 Kettlebell Swings (24 kg)
311	MATTY G	For Time	26 Rounds: 5 Pull-Ups, 10 Push-Ups, 15 Air Squats
312	McGHEE	For Time	30 minute: 5 Deadlifts (125 kg), 13 Push-Ups, 9 Box Jumps (61 cm)
313	MCKEOWN	For Time	4 Rounds: 400 meter Run, 16 Kettlebell Swings (24 kg), 12 Pull-Ups
314	MACHO BEAR	For Time	5 Rounds: 3 Power Cleans (84 kg), 3 Front Squats (84 kg), 3 Jerks (84 kg); Rest 3 minutes between rounds.
315	MANNY	For Time	5 Rounds: 400 m Run, 13 Toes-to-Bar, 13 Deadlifts (102 kg), 13 Burpees Over the Bar
316	MARTIN	For Time	3 Rounds: 800 m Run, 20 Pull-Ups, 30 Kettlebell Swings (24 kg), 40 Air Squats
317	MATTHEW	For Time	4 Rounds: 400 m Run, 15 Bench Presses (70 kg), 15 Back Squats (70 kg)
318	MCCLAIN	For Time	4 Rounds: 9 Front Squats (84 kg), 15 Kettlebell Swings (32 kg), 21 Box Jumps (61 cm)
319	MORRISON	For Time	50-40-30-20-10 reps: Wall Ball Shots (9 kg), Box Jumps (61 cm), Kettlebell Swings (24 kg)
320	NATE	AMRAP	20 Minutes: 2 Muscle-Ups, 4 Handstand Push-Ups, 8 Kettlebell Swings (32 kg)
321	NED	For Time	7 Rounds: 11 Back Squats (102 kg), 1,000 m Row
322	NUTTS	For Time	10 Handstand Push-Ups, 15 Deadlifts (113 kg), 25 Box Jumps (76 cm), 50 Pull-Ups, 100 Wall Ball Shots (9 kg), 400 m Run with 20 kg plate
323	PAUL	For Time	5 Rounds: 50 Double-Unders, 35 Knees-to-Elbows, 20 Yard Overhead Walk (43 kg barbell)
325	RILEY	For Time	1.5 mile Run, 150 Burpees, 1.5 mile Run; Wear a 9 kg weight vest if available.
326	RJ	For Time	5 Rounds: 800 m Run, 5 Rope Climbs (4.5 m), 50 Push-Ups
327	RORY	AMRAP	20 Minutes: 20 Thrusters (43 kg), 20 Alternating Single-Leg Squats, 20 Ring Dips
332	WILMOT	For Time	6 Rounds: 50 Air Squats, 25 Ring Dips, 400 m Run
335	WITTMAN	For Time	7 Rounds: 15 Kettlebell Swings (24 kg), 15 Power Cleans (43 kg), 15 Box Jumps (61 cm)
336	ZACH	For Time	6 Rounds: 6 Squat Snatches (70 kg), 11 Pull-Ups, 6 Thrusters (70 kg), 11 Toes-to-Bar
337	ZEMAN	For Time	5 Rounds: 400 m Run, 30 Wall Balls (9 kg), 30 Sumo Deadlift High-Pulls (43 kg)
338	ZIMMERMAN	AMRAP	25 Minutes: 11 Chest-to-Bar Pull-Ups, 2 Deadlifts (143 kg), 10 Handstand Push-Ups
339	STEPHEN	For Time	30-25-20-15-10-5 reps: GHD Sit-Ups, Back Extensions, Knees-to-Elbows, Sit-Ups
340	SANTIAGO	For Time	7 Rounds: 18 Dumbbell Hang Squat Cleans (22.5 kg each), 18 Pull-Ups, 10 Power Cleans (61 kg), 10 Handstand Push-Ups
341	SEVERIN	For Time	50 Strict Pull-Ups, 100 Hand-Release Push-Ups, 5 km Run; Wear a 9 kg vest if available.
342	SHAM	For Time	7 Rounds: 11 Bodyweight Deadlifts, 100-meter Sprint; Rest 2 minutes between rounds
343	SHIP	For Time	9 Rounds: 7 Squat Cleans (84 kg), 8 Burpee Box Jumps (61 cm)
344	SIMPSON	AMRAP	20 Minutes: 5 Parallette Handstand Push-Ups, 10 Toes-to-Bar
345	SMALL	For Time	3 Rounds: 1,000-meter Row, 50 Burpees, 50 Box Jumps (61 cm), 800-meter Run
346	SPEHAR	For Time	100 Thrusters (20 kg), 100 Pull-Ups, 800-meter Weighted Run (20 kg), 100 Handstand Push-Ups, 100 Kettlebell Swings (24 kg), 800-meter Weighted Run (20 kg)
347	STONE	For Time	5 Rounds: 30 Push-Ups, 30 Ring Dips, 15-foot Rope Climb, 400-meter Run
348	SWARTZ	For Time	5 Rounds: 5 Burpees, 10 Pull-Ups, 20 Push-Ups, 30 Sit-Ups, 400-meter Run
349	ZOEY	For Time	3 Rounds: 30 Wall Balls (9 kg), 30 Sumo Deadlift High-Pulls (43 kg), 30 Box Jumps (61 cm)
350	TERRY	For Time	1-mile Run, 100 Push-Ups, 100-meter Bear Crawl, 1-mile Run, 100-meter Bear Crawl, 100 Push-Ups, 1-mile Run
351	THOMPSON	For Time	10 Rounds: 1 Rope Climb (4.5 m), 29 Back Squats (61 kg), 10-meter Barbell Farmer Carry (61 kg each hand)
352	TILLMAN	For Time	7 Rounds: 7 Deadlifts (143 kg), 200-meter Sprint, 15 Pull-Ups, 45-second Rest
353	TK	AMRAP	20 Minutes: 8 Strict Pull-Ups, 8 Box Jumps (76 cm), 12 Kettlebell Swings (32 kg)
354	TOMMY MAC	For Time	12 Burpees, 12 Thrusters (61 kg), 12 Burpees, 12 Power Snatches (61 kg), 12 Burpees, 12 Push Jerks (61 kg), 12 Burpees, 12 Hang Squat Cleans (61 kg), 12 Burpees, 12 Overhead Squats (61 kg)
357	TUMILSON	For Time	8 Rounds: Run 200 meters, 11 Dumbbell Burpee Deadlifts (22.5 kg each)
359	RAGNA	For Time	5 Rounds: 400-meter Run, 15 Overhead Squats (43 kg), 15 Pull-Ups
360	RAY	For Time	5 Rounds: 225-meter Run, 15 Push-Ups, 15 Overhead Squats (43 kg)
361	RICK	For Time	10 Rounds: 10 Deadlifts (102 kg), 20 Push-Ups, 30 Box Jumps (61 cm)
362	ROBERT	For Time	6 Rounds: 20 Pull-Ups, 40 Push-Ups, 60 Squats, 800-meter Run
363	ROBIN	For Time	4 Rounds: 400-meter Run, 20 Burpees, 20 Kettlebell Swings (24 kg)
364	ROCKY	For Time	3 Rounds: 800-meter Run, 30 Kettlebell Swings (24 kg), 30 Box Jumps (61 cm)
365	ROGERS	For Time	5 Rounds: 400-meter Run, 15 Deadlifts (102 kg), 15 Pull-Ups
366	ROSE	For Time	4 Rounds: 400-meter Run, 20 Thrusters (43 kg), 20 Pull-Ups
367	RUDY	For Time	5 Rounds: 400-meter Run, 15 Power Cleans (61 kg), 15 Pull-Ups
368	RYAN	For Time	5 Rounds: 7 Muscle-Ups, 21 Burpees; Each burpee terminates with a jump one foot above max standing reach.
369	SAGE	For Time	20 Thrusters (43 kg), 20 Pull-Ups, 20 Power Cleans (61 kg), 20 Pull-Ups, 20 Overhead Squats (43 kg), 20 Pull-Ups
370	SANTORA	For Time	3 Rounds: 155 Squats, 50 Push-Ups, 155 Walking Lunges, 50 Push-Ups
371	SCOTT	For Time	11 Push Presses (52 kg), 50 Double-Unders, 11 Thrusters (52 kg), 50 Double-Unders, 11 Push Presses (52 kg), 50 Double-Unders, 11 Thrusters (52 kg), 50 Double-Unders
372	SEAN	For Time	10 Rounds: 11 Chest-to-Bar Pull-Ups, 2 Deadlifts (143 kg), 10 Handstand Push-Ups
373	SHAWN	For Time	5 Rounds: 200-meter Run, 11 Bodyweight Back Squats
374	SHAY	For Time	5 Rounds: 200-meter Run, 15 Chest-to-Bar Pull-Ups
375	SHIVAN	For Time	4 Rounds: 400-meter Run, 15 Deadlifts (102 kg), 15 Pull-Ups
376	SMITH	For Time	6 Rounds: 200-meter Run, 3 Deadlifts (143 kg), 10 Toes-to-Bar
377	SPEEDY	For Time	5 Rounds: 200-meter Run, 9 Power Cleans (61 kg), 9 Burpees
378	SPENCER	For Time	10 Rounds: 100-meter Sprint, 10 Burpees
379	STEWART	For Time	5 Rounds: 200-meter Run, 11 Push-Ups, 11 Box Jumps (61 cm)
380	STONER	For Time	5 Rounds: 200-meter Run, 10 Push-Ups, 10 Squat Cleans (61 kg)
381	STOUT	For Time	5 Rounds: 200-meter Run, 15 Kettlebell Swings (24 kg), 15 Pull-Ups
382	TAYLOR	For Time	4 Rounds: 400-meter Run, 5 Burpee Muscle-Ups
383	TOM	For Time	7 Rounds: 7 Muscle-Ups, 11 Thrusters (52 kg), 14 Toes-to-Bar
384	TOMMY	For Time	21 Thrusters (43 kg), 12 Rope Climbs, 15 Thrusters (43 kg), 9 Rope Climbs, 9 Thrusters (43 kg), 6 Rope Climbs
385	TREVOR	For Time	Team of Four: 300 Pull-Ups, 400 Push-Ups, 500 Sit-Ups, 600 Air Squats; Only two athletes can work at a time.
386	TULLY	For Time	4 Rounds: 200-meter Swim, 23 Wall Ball Shots (9 kg), 23 Kettlebell Swings (24 kg), 23 Pull-Ups, 23 Burpees
387	TYLER	For Time	5 Rounds: 7 Muscle-Ups, 21 Sumo Deadlift High-Pulls (43 kg)
388	WALKER	For Time	4 Rounds: 800-meter Run, 400-meter Run with 20-kg plate
389	WALLACE	For Time	3 Rounds: 21 Deadlifts (102 kg), 15 Pull-Ups, 9 Overhead Squats (43 kg)
390	WELSH	For Time	5 Rounds: 200-meter Run, 10 Overhead Squats (43 kg), 10 Box Jumps (61 cm)
391	WHITE	For Time	5 Rounds: 3 Rope Climbs (4.5 m), 10 Toes-to-Bar, 21 Walking Lunges with 32 kg kettlebell
392	WILSON	For Time	30 Kettlebell Swings (32 kg), 30 Box Jumps (61 cm), 30 Overhead Squats (43 kg)
393	WOOD	5 Rounds for Time	5 Rounds: 400-meter Run, 10 Burpee Box Jumps (61 cm), 10 Sumo Deadlift High-Pulls (43 kg), 10 Thrusters (43 kg), Rest 1 minute
394	WOODROW	For Time	5 Rounds: 400-meter Run, 10 Burpee Box Jumps (61 cm), 10 Sumo Deadlift High-Pulls (43 kg), 10 Thrusters (43 kg), Rest 1 minute
395	KELLIKAS	EMOM	For load:\nEMOM 12:\n3 power cleans\n2 hang power cleans\n1 push jerk\n– Build in load.\n\nPost-workout\nOn an 8:00 clock:\nRow, bike, or ski
396	AS	For Time	On a 16:00 clock:\n0:00-10:00:\nMin 1: bike\nMin 2: rest\n10:00-16:00:\nBuild to a heavy 3-rep shoulder-to-overhead\n\nPost-workout\nOn a 5:00 clock:\nAccumulate as much time as possible in an L-sit.
397	AA	For Time	5 rounds for time of:\n15/18-cal row\n12 deadlifts (47/70 kg)\n9 hang power cleans\n\nPost-workout\nAccumulate:\n2:00 weighted plank hold
\.


--
-- Data for Name: paymentMetadata; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."paymentMetadata" (id, "transactionId", "montonioUuid", "contractId", "affiliateId", "isPaymentHoliday", "createdAt") FROM stdin;
1	1	283c1e0a-7427-47b8-8d71-072d6f48a22d	1	2	f	2025-03-22 17:35:55.295
2	2	5a4d8820-62e7-45d1-8b2d-4b87a8b862bc	1	2	f	2025-03-22 17:38:38.386
3	3	06ba9a6f-1d61-48ac-b0a3-79225a6e4621	2	1	f	2025-03-22 18:36:05.409
\.


--
-- Data for Name: todayWOD; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public."todayWOD" (id, "wodName", type, description, date, "affiliateId") FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: irontrackuser
--

COPY public.transactions (id, "userId", amount, "invoiceNumber", description, "createdAt", status, type, "affiliateId", "planId", "creditId", "contractId", "isCredit", decrease, "memberId") FROM stdin;
1	3	85	contract-1-1742664954615	Contract payment: Monthly Contract Payment	2025-03-22 17:35:55.282	success	contract	2	\N	\N	\N	f	t	\N
2	3	85	contract-1-1742665117635	Contract payment: Monthly Contract Payment	2025-03-22 17:38:38.371	success	contract	2	\N	\N	\N	f	t	\N
3	4	75	contract-2-1742668564776	Contract payment: Monthly Contract Payment	2025-03-22 18:36:05.398	success	contract	1	\N	\N	\N	f	t	\N
4	4	10	20250322183652	Plan purchase: 1 time pass, by: v@v.v, from: Crossfit Viljandi, paid by credit: 0€	2025-03-22 18:37:04.424	success	montonio	1	2	\N	\N	f	t	1
5	3	15	20250322183908	Plan purchase: 1 time pass, by: c@c.c, from: Crossfit Tartu	2025-03-22 18:39:08.814	success	debit	2	6	\N	\N	f	t	2
6	3	1500	20250322183938	stebby	2025-03-22 18:39:38.91	success	\N	2	\N	1	\N	t	f	\N
\.


--
-- Name: AffiliateApiKeys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."AffiliateApiKeys_id_seq"', 2, true);


--
-- Name: AffiliateTrainer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."AffiliateTrainer_id_seq"', 4, true);


--
-- Name: Affiliate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."Affiliate_id_seq"', 2, true);


--
-- Name: ClassAttendee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."ClassAttendee_id_seq"', 1, true);


--
-- Name: ClassLeaderboard_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."ClassLeaderboard_id_seq"', 1, false);


--
-- Name: ClassSchedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."ClassSchedule_id_seq"', 4770, true);


--
-- Name: ContractLogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."ContractLogs_id_seq"', 4, true);


--
-- Name: ContractTerms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."ContractTerms_id_seq"', 2, true);


--
-- Name: Contract_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."Contract_id_seq"', 2, true);


--
-- Name: Credit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."Credit_id_seq"', 1, true);


--
-- Name: Exercise_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."Exercise_id_seq"', 2, true);


--
-- Name: Members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."Members_id_seq"', 2, true);


--
-- Name: MessageGroup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."MessageGroup_id_seq"', 1, true);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."Message_id_seq"', 1, true);


--
-- Name: PaymentHoliday_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."PaymentHoliday_id_seq"', 1, false);


--
-- Name: Plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."Plan_id_seq"', 6, true);


--
-- Name: Record_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."Record_id_seq"', 2, true);


--
-- Name: SectorComment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."SectorComment_id_seq"', 1, false);


--
-- Name: SectorYoutubeLink_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."SectorYoutubeLink_id_seq"', 3, true);


--
-- Name: SignedContract_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."SignedContract_id_seq"', 3, true);


--
-- Name: TrainingDay_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."TrainingDay_id_seq"', 1, true);


--
-- Name: TrainingPlan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."TrainingPlan_id_seq"', 1, true);


--
-- Name: TrainingSector_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."TrainingSector_id_seq"', 3, true);


--
-- Name: Training_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."Training_id_seq"', 2, true);


--
-- Name: UserMessageGroup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."UserMessageGroup_id_seq"', 1, true);


--
-- Name: UserNote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."UserNote_id_seq"', 1, false);


--
-- Name: UserPlan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."UserPlan_id_seq"', 4, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."User_id_seq"', 6, true);


--
-- Name: Waitlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."Waitlist_id_seq"', 1, false);


--
-- Name: defaultWOD_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."defaultWOD_id_seq"', 1, false);


--
-- Name: paymentMetadata_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."paymentMetadata_id_seq"', 3, true);


--
-- Name: todayWOD_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public."todayWOD_id_seq"', 1, false);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: irontrackuser
--

SELECT pg_catalog.setval('public.transactions_id_seq', 6, true);


--
-- Name: AffiliateApiKeys AffiliateApiKeys_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."AffiliateApiKeys"
    ADD CONSTRAINT "AffiliateApiKeys_pkey" PRIMARY KEY (id);


--
-- Name: AffiliateTrainer AffiliateTrainer_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."AffiliateTrainer"
    ADD CONSTRAINT "AffiliateTrainer_pkey" PRIMARY KEY (id);


--
-- Name: Affiliate Affiliate_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Affiliate"
    ADD CONSTRAINT "Affiliate_pkey" PRIMARY KEY (id);


--
-- Name: ClassAttendee ClassAttendee_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ClassAttendee"
    ADD CONSTRAINT "ClassAttendee_pkey" PRIMARY KEY (id);


--
-- Name: ClassLeaderboard ClassLeaderboard_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ClassLeaderboard"
    ADD CONSTRAINT "ClassLeaderboard_pkey" PRIMARY KEY (id);


--
-- Name: ClassSchedule ClassSchedule_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ClassSchedule"
    ADD CONSTRAINT "ClassSchedule_pkey" PRIMARY KEY (id);


--
-- Name: ContractLogs ContractLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ContractLogs"
    ADD CONSTRAINT "ContractLogs_pkey" PRIMARY KEY (id);


--
-- Name: ContractTemplate ContractTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ContractTemplate"
    ADD CONSTRAINT "ContractTemplate_pkey" PRIMARY KEY (id);


--
-- Name: ContractTerms ContractTerms_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ContractTerms"
    ADD CONSTRAINT "ContractTerms_pkey" PRIMARY KEY (id);


--
-- Name: Contract Contract_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_pkey" PRIMARY KEY (id);


--
-- Name: Credit Credit_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Credit"
    ADD CONSTRAINT "Credit_pkey" PRIMARY KEY (id);


--
-- Name: Exercise Exercise_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Exercise"
    ADD CONSTRAINT "Exercise_pkey" PRIMARY KEY (id);


--
-- Name: Members Members_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Members"
    ADD CONSTRAINT "Members_pkey" PRIMARY KEY (id);


--
-- Name: MessageGroup MessageGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."MessageGroup"
    ADD CONSTRAINT "MessageGroup_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: PaymentHoliday PaymentHoliday_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."PaymentHoliday"
    ADD CONSTRAINT "PaymentHoliday_pkey" PRIMARY KEY (id);


--
-- Name: Plan Plan_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Plan"
    ADD CONSTRAINT "Plan_pkey" PRIMARY KEY (id);


--
-- Name: Record Record_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Record"
    ADD CONSTRAINT "Record_pkey" PRIMARY KEY (id);


--
-- Name: SectorComment SectorComment_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."SectorComment"
    ADD CONSTRAINT "SectorComment_pkey" PRIMARY KEY (id);


--
-- Name: SectorYoutubeLink SectorYoutubeLink_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."SectorYoutubeLink"
    ADD CONSTRAINT "SectorYoutubeLink_pkey" PRIMARY KEY (id);


--
-- Name: SignedContract SignedContract_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."SignedContract"
    ADD CONSTRAINT "SignedContract_pkey" PRIMARY KEY (id);


--
-- Name: TrainingDay TrainingDay_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."TrainingDay"
    ADD CONSTRAINT "TrainingDay_pkey" PRIMARY KEY (id);


--
-- Name: TrainingPlan TrainingPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."TrainingPlan"
    ADD CONSTRAINT "TrainingPlan_pkey" PRIMARY KEY (id);


--
-- Name: TrainingSector TrainingSector_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."TrainingSector"
    ADD CONSTRAINT "TrainingSector_pkey" PRIMARY KEY (id);


--
-- Name: Training Training_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Training"
    ADD CONSTRAINT "Training_pkey" PRIMARY KEY (id);


--
-- Name: UserMessageGroup UserMessageGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."UserMessageGroup"
    ADD CONSTRAINT "UserMessageGroup_pkey" PRIMARY KEY (id);


--
-- Name: UserNote UserNote_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."UserNote"
    ADD CONSTRAINT "UserNote_pkey" PRIMARY KEY (id);


--
-- Name: UserPlan UserPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."UserPlan"
    ADD CONSTRAINT "UserPlan_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Waitlist Waitlist_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Waitlist"
    ADD CONSTRAINT "Waitlist_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: defaultWOD defaultWOD_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."defaultWOD"
    ADD CONSTRAINT "defaultWOD_pkey" PRIMARY KEY (id);


--
-- Name: paymentMetadata paymentMetadata_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."paymentMetadata"
    ADD CONSTRAINT "paymentMetadata_pkey" PRIMARY KEY (id);


--
-- Name: todayWOD todayWOD_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."todayWOD"
    ADD CONSTRAINT "todayWOD_pkey" PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: AffiliateTrainer_affiliateId_trainerId_key; Type: INDEX; Schema: public; Owner: irontrackuser
--

CREATE UNIQUE INDEX "AffiliateTrainer_affiliateId_trainerId_key" ON public."AffiliateTrainer" USING btree ("affiliateId", "trainerId");


--
-- Name: Affiliate_subdomain_key; Type: INDEX; Schema: public; Owner: irontrackuser
--

CREATE UNIQUE INDEX "Affiliate_subdomain_key" ON public."Affiliate" USING btree (subdomain);


--
-- Name: ClassAttendee_classId_userId_key; Type: INDEX; Schema: public; Owner: irontrackuser
--

CREATE UNIQUE INDEX "ClassAttendee_classId_userId_key" ON public."ClassAttendee" USING btree ("classId", "userId");


--
-- Name: Credit_userId_affiliateId_key; Type: INDEX; Schema: public; Owner: irontrackuser
--

CREATE UNIQUE INDEX "Credit_userId_affiliateId_key" ON public."Credit" USING btree ("userId", "affiliateId");


--
-- Name: Members_userId_affiliateId_key; Type: INDEX; Schema: public; Owner: irontrackuser
--

CREATE UNIQUE INDEX "Members_userId_affiliateId_key" ON public."Members" USING btree ("userId", "affiliateId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: irontrackuser
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Waitlist_classId_userId_key; Type: INDEX; Schema: public; Owner: irontrackuser
--

CREATE UNIQUE INDEX "Waitlist_classId_userId_key" ON public."Waitlist" USING btree ("classId", "userId");


--
-- Name: defaultWOD_name_key; Type: INDEX; Schema: public; Owner: irontrackuser
--

CREATE UNIQUE INDEX "defaultWOD_name_key" ON public."defaultWOD" USING btree (name);


--
-- Name: paymentMetadata_montonioUuid_contractId_key; Type: INDEX; Schema: public; Owner: irontrackuser
--

CREATE UNIQUE INDEX "paymentMetadata_montonioUuid_contractId_key" ON public."paymentMetadata" USING btree ("montonioUuid", "contractId");


--
-- Name: AffiliateApiKeys AffiliateApiKeys_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."AffiliateApiKeys"
    ADD CONSTRAINT "AffiliateApiKeys_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AffiliateTrainer AffiliateTrainer_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."AffiliateTrainer"
    ADD CONSTRAINT "AffiliateTrainer_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AffiliateTrainer AffiliateTrainer_trainerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."AffiliateTrainer"
    ADD CONSTRAINT "AffiliateTrainer_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Affiliate Affiliate_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Affiliate"
    ADD CONSTRAINT "Affiliate_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ClassAttendee ClassAttendee_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ClassAttendee"
    ADD CONSTRAINT "ClassAttendee_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ClassAttendee ClassAttendee_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ClassAttendee"
    ADD CONSTRAINT "ClassAttendee_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."ClassSchedule"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ClassAttendee ClassAttendee_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ClassAttendee"
    ADD CONSTRAINT "ClassAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ClassLeaderboard ClassLeaderboard_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ClassLeaderboard"
    ADD CONSTRAINT "ClassLeaderboard_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."ClassSchedule"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ClassLeaderboard ClassLeaderboard_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ClassLeaderboard"
    ADD CONSTRAINT "ClassLeaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ClassSchedule ClassSchedule_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ClassSchedule"
    ADD CONSTRAINT "ClassSchedule_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ClassSchedule ClassSchedule_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ClassSchedule"
    ADD CONSTRAINT "ClassSchedule_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ContractLogs ContractLogs_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ContractLogs"
    ADD CONSTRAINT "ContractLogs_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ContractLogs ContractLogs_contractId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ContractLogs"
    ADD CONSTRAINT "ContractLogs_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES public."Contract"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ContractLogs ContractLogs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ContractLogs"
    ADD CONSTRAINT "ContractLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ContractTemplate ContractTemplate_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."ContractTemplate"
    ADD CONSTRAINT "ContractTemplate_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Contract Contract_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Contract Contract_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Contract"
    ADD CONSTRAINT "Contract_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Credit Credit_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Credit"
    ADD CONSTRAINT "Credit_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Credit Credit_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Credit"
    ADD CONSTRAINT "Credit_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Exercise Exercise_trainingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Exercise"
    ADD CONSTRAINT "Exercise_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES public."Training"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Members Members_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Members"
    ADD CONSTRAINT "Members_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Members Members_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Members"
    ADD CONSTRAINT "Members_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MessageGroup MessageGroup_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."MessageGroup"
    ADD CONSTRAINT "MessageGroup_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentHoliday PaymentHoliday_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."PaymentHoliday"
    ADD CONSTRAINT "PaymentHoliday_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentHoliday PaymentHoliday_contractId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."PaymentHoliday"
    ADD CONSTRAINT "PaymentHoliday_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES public."Contract"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentHoliday PaymentHoliday_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."PaymentHoliday"
    ADD CONSTRAINT "PaymentHoliday_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Plan Plan_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Plan"
    ADD CONSTRAINT "Plan_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Plan Plan_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Plan"
    ADD CONSTRAINT "Plan_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Record Record_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Record"
    ADD CONSTRAINT "Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SectorComment SectorComment_trainingDayId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."SectorComment"
    ADD CONSTRAINT "SectorComment_trainingDayId_fkey" FOREIGN KEY ("trainingDayId") REFERENCES public."TrainingDay"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SectorComment SectorComment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."SectorComment"
    ADD CONSTRAINT "SectorComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SectorYoutubeLink SectorYoutubeLink_trainingSectorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."SectorYoutubeLink"
    ADD CONSTRAINT "SectorYoutubeLink_trainingSectorId_fkey" FOREIGN KEY ("trainingSectorId") REFERENCES public."TrainingSector"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SignedContract SignedContract_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."SignedContract"
    ADD CONSTRAINT "SignedContract_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SignedContract SignedContract_contractId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."SignedContract"
    ADD CONSTRAINT "SignedContract_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES public."Contract"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SignedContract SignedContract_contractTermsId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."SignedContract"
    ADD CONSTRAINT "SignedContract_contractTermsId_fkey" FOREIGN KEY ("contractTermsId") REFERENCES public."ContractTerms"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SignedContract SignedContract_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."SignedContract"
    ADD CONSTRAINT "SignedContract_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TrainingDay TrainingDay_trainingPlanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."TrainingDay"
    ADD CONSTRAINT "TrainingDay_trainingPlanId_fkey" FOREIGN KEY ("trainingPlanId") REFERENCES public."TrainingPlan"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TrainingPlan TrainingPlan_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."TrainingPlan"
    ADD CONSTRAINT "TrainingPlan_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TrainingPlan TrainingPlan_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."TrainingPlan"
    ADD CONSTRAINT "TrainingPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TrainingSector TrainingSector_trainingDayId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."TrainingSector"
    ADD CONSTRAINT "TrainingSector_trainingDayId_fkey" FOREIGN KEY ("trainingDayId") REFERENCES public."TrainingDay"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Training Training_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Training"
    ADD CONSTRAINT "Training_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserMessageGroup UserMessageGroup_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."UserMessageGroup"
    ADD CONSTRAINT "UserMessageGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."MessageGroup"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserMessageGroup UserMessageGroup_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."UserMessageGroup"
    ADD CONSTRAINT "UserMessageGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserNote UserNote_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."UserNote"
    ADD CONSTRAINT "UserNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserPlan UserPlan_contractId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."UserPlan"
    ADD CONSTRAINT "UserPlan_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES public."Contract"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserPlan UserPlan_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."UserPlan"
    ADD CONSTRAINT "UserPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Waitlist Waitlist_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Waitlist"
    ADD CONSTRAINT "Waitlist_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."ClassSchedule"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Waitlist Waitlist_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Waitlist"
    ADD CONSTRAINT "Waitlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Waitlist Waitlist_userPlanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."Waitlist"
    ADD CONSTRAINT "Waitlist_userPlanId_fkey" FOREIGN KEY ("userPlanId") REFERENCES public."UserPlan"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: todayWOD todayWOD_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public."todayWOD"
    ADD CONSTRAINT "todayWOD_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_affiliateId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES public."Affiliate"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_creditId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES public."Credit"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transactions transactions_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES public."Members"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transactions transactions_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_planId_fkey" FOREIGN KEY ("planId") REFERENCES public."Plan"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transactions transactions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: irontrackuser
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO irontrackuser;


--
-- PostgreSQL database dump complete
--

