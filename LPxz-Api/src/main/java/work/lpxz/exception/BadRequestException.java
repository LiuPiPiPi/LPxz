package work.lpxz.exception;

/**
 * @author LPxz
 * @date 2024/1/13
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException() {
    }

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }

}
