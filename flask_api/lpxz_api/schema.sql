drop table if exists article_tag;
drop table if exists article;
drop table if exists category;
drop table if exists tag;
drop table if exists moment;
drop table if exists friend;
drop table if exists about;
drop table if exists site_setting;
drop table if exists schedule_job_log;
drop table if exists schedule_job;
drop table if exists visit_log;
drop table if exists exception_log;
drop table if exists login_log;
drop table if exists operation_log;
drop table if exists user;

create table user (
    id integer primary key autoincrement,
    username text not null unique,
    password text not null,
    nickname text,
    avatar text,
    email text,
    role text not null default 'ROLE_admin',
    gmt_create text,
    gmt_modified text
);

create table category (
    id integer primary key autoincrement,
    category_name text not null
);

create table tag (
    id integer primary key autoincrement,
    tag_name text not null,
    color text
);

create table article (
    id integer primary key autoincrement,
    title text not null,
    cover text,
    content text not null,
    description text not null,
    is_published integer not null default 0,
    is_recommend integer not null default 0,
    is_appreciation integer not null default 0,
    is_top integer not null default 0,
    views integer not null default 0,
    words integer not null default 0,
    read_time integer not null default 0,
    password text not null default '',
    category_id integer,
    user_id integer,
    gmt_create text,
    gmt_modified text,
    foreign key (category_id) references category(id) on delete set null,
    foreign key (user_id) references user(id) on delete set null
);

create table article_tag (
    article_id integer not null,
    tag_id integer not null,
    primary key (article_id, tag_id),
    foreign key (article_id) references article(id) on delete cascade,
    foreign key (tag_id) references tag(id) on delete cascade
);

create table moment (
    id integer primary key autoincrement,
    content text not null,
    likes integer not null default 0,
    is_published integer not null default 0,
    gmt_create text
);

create table friend (
    id integer primary key autoincrement,
    nickname text not null,
    description text,
    website text,
    avatar text,
    is_published integer not null default 0,
    views integer not null default 0,
    gmt_create text
);

create table about (
    id integer primary key autoincrement,
    name_en text not null,
    name_zh text,
    value text
);

create table site_setting (
    id integer primary key autoincrement,
    name_en text not null,
    name_zh text,
    value text,
    type integer not null default 1
);

create table operation_log (
    id integer primary key autoincrement,
    username text,
    uri text,
    method text,
    description text,
    ip text,
    ip_source text,
    os text,
    browser text,
    times integer,
    user_agent text,
    param text,
    gmt_create text
);

create table login_log (
    id integer primary key autoincrement,
    username text,
    ip text,
    ip_source text,
    os text,
    browser text,
    status integer,
    description text,
    user_agent text,
    gmt_create text
);

create table exception_log (
    id integer primary key autoincrement,
    uri text,
    method text,
    description text,
    error text,
    ip text,
    ip_source text,
    os text,
    browser text,
    user_agent text,
    param text,
    gmt_create text
);

create table visit_log (
    id integer primary key autoincrement,
    uuid text,
    uri text,
    method text,
    behavior text,
    content text,
    remark text,
    ip text,
    ip_source text,
    os text,
    browser text,
    user_agent text,
    param text,
    gmt_create text
);

create table schedule_job_log (
    log_id integer primary key autoincrement,
    job_id integer,
    bean_name text,
    method_name text,
    params text,
    status integer,
    error text,
    times integer,
    gmt_create text
);

create table schedule_job (
    job_id integer primary key autoincrement,
    bean_name text not null,
    method_name text not null,
    params text,
    cron text not null,
    status integer not null default 0,
    remark text,
    gmt_create text
);

create index idx_article_public_created on article (is_published, is_top, gmt_create);
create index idx_article_category on article (category_id);
create index idx_article_title on article (title);
create index idx_moment_public_created on moment (is_published, gmt_create);
create index idx_friend_public on friend (is_published);
create index idx_operation_log_created on operation_log (gmt_create);
create index idx_login_log_created on login_log (gmt_create);
create index idx_exception_log_created on exception_log (gmt_create);
create index idx_visit_log_created on visit_log (gmt_create);
create index idx_visit_log_uuid on visit_log (uuid);
create index idx_schedule_job_log_created on schedule_job_log (gmt_create);
create index idx_schedule_job_status on schedule_job (status);

insert into schedule_job (job_id, bean_name, method_name, params, cron, status, remark, gmt_create)
values (1, 'redisSyncScheduleTask', 'syncArticleViewsToDatabase', '', '0 0 1 * * ?', 1, '每天凌晨一点，从Redis将文章浏览量同步到数据库', datetime('now', 'localtime'));

insert into schedule_job (job_id, bean_name, method_name, params, cron, status, remark, gmt_create)
values (2, 'visitorSyncScheduleTask', 'syncVisitInfoToDatabase', '', '0 0 0 * * ?', 0, '清空当天Redis访客标识，记录当天的PV和UV，更新访客统计', datetime('now', 'localtime'));
