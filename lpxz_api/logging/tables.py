from ..core.db import execute


def ensure_log_tables():
    execute(
        """
        create table if not exists operation_log (
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
        )
        """
    )
    execute(
        """
        create table if not exists login_log (
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
        )
        """
    )
    execute(
        """
        create table if not exists exception_log (
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
        )
        """
    )
    execute(
        """
        create table if not exists visit_log (
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
        )
        """
    )
    execute(
        """
        create table if not exists schedule_job_log (
            log_id integer primary key autoincrement,
            job_id integer,
            bean_name text,
            method_name text,
            params text,
            status integer,
            error text,
            times integer,
            gmt_create text
        )
        """
    )
